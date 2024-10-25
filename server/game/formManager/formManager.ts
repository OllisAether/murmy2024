import { FormFieldValue, getPoints } from '../../../shared/form'
import { form as finalForm, getFieldFromId } from '../../../shared/assets/form'
import { Result } from '../../../shared/results'
import { colorize, Fg } from '../../console'
import { Database } from '../../database'
import { Game } from '../game'

export class FormManager {
  private forms: {
    [teamId: string]: Record<string, FormFieldValue>
  } = {}
  private formPage: {
    [teamId: string]: number
  } = {}
  private submittedForms: string[] = []
  private results: Record<string, number> = {}

  public save () {
    Database.get().saveCollection('forms', {
      forms: this.forms,
      formPage: this.formPage,
      results: this.results,
      submittedForms: this.submittedForms,
    })
  }

  public load () {
    const data = Database.get().collections['forms']

    if (!data) {
      return
    }

    const forms = data.forms

    if (
      !forms ||
      typeof forms !== 'object' ||
      Array.isArray(forms) ||
      Object.keys(forms).some((key) =>
        typeof key !== 'string'
        || typeof forms[key] !== 'object'
        || Array.isArray(forms[key]))
    ) {
      console.error(colorize('[FormManager]', Fg.Blue), 'Invalid forms data', forms)
      return
    } else {
      this.forms = forms as Record<string, Record<string, FormFieldValue>>
    }

    const formPage = data.formPage

    if (
      !formPage ||
      typeof formPage !== 'object' ||
      Array.isArray(formPage) ||
      Object.keys(formPage).some((key) =>
        typeof key !== 'string'
        || typeof formPage[key] !== 'number')
    ) {
      console.error(colorize('[FormManager]', Fg.Blue), 'Invalid formPage data', formPage)
      return
    } else {
      this.formPage = formPage as Record<string, number>
    }

    const results = data.results

    if (
      !results ||
      typeof results !== 'object' ||
      Array.isArray(results) ||
      Object.keys(results).some((key) =>
        typeof key !== 'string'
        || typeof results[key] !== 'number')
    ) {
      console.error(colorize('[FormManager]', Fg.Blue), 'Invalid results data', results)
      return
    } else {
      this.results = results as Record<string, number>
    }

    if (
      !Array.isArray(data.submittedForms) ||
      data.submittedForms.some((teamId) => typeof teamId !== 'string')
    ) {
      console.error(colorize('[FormManager]', Fg.Blue), 'Invalid submittedForms data', data.submittedForms)
      return
    } else {
      this.submittedForms = data.submittedForms as string[]
    }
  }

  public clean (): void {
    const game = Game.get()

    Object.keys(this.forms).forEach((teamId) => {
      const team = game.getTeam(teamId)

      if (!team) {
        console.error(colorize('[FormManager]', Fg.Blue), 'Invalid team', teamId)
        delete this.forms[teamId]
      }
    })

    this.submittedForms = this.submittedForms.filter((teamId) => game.getTeam(teamId))

    Object.keys(this.results).forEach((teamId) => {
      const team = game.getTeam(teamId)

      if (!team) {
        console.error(colorize('[FormManager]', Fg.Blue), 'Invalid team', teamId)
        delete this.results[teamId]
      }
    })

    this.save()
    Game.get().sendFormToTeamClient()
    Game.get().sendResultsToBoard()
    Game.get().sendFormsToAdmins()
  }

  public getForms(): Record<string, Record<string, FormFieldValue>> {
    return this.forms
  }

  public getForm(teamId: string): Record<string, FormFieldValue> {
    return this.forms[teamId]
  }

  public getResults(): Result[] {
    const game = Game.get()
    const suspectDatabaseManager = game.suspectDatabaseManager

    const teams = game.getTeams()

    const results: Result[] = teams.map((team) => {
      const teamId = team.id
      const teamName = team.name
      const teamMeta = team.meta

      return {
        team: {
          id: teamId,
          name: teamName,
          meta: teamMeta,
        },
        score: this.results[teamId] || 0,
        entries: suspectDatabaseManager.getDatabase(teamId).entries.length,
      }
    })

    return results
  }

  public getResult(teamId: string): number {
    return this.results[teamId] || 0
  }

  public getSubmittedForms(): string[] {
    return this.submittedForms
  }

  public getFormPage(teamId: string): number {
    return this.formPage[teamId] || 0
  }

  public getFormPages(): Record<string, number> {
    return this.formPage
  }

  public setFormPage(teamId: string, page: number): void {
    console.log(colorize('[FormManager]', Fg.Blue), 'Setting form page', teamId, page);

    this.formPage[teamId] = page

    const teamClient = Game.get().getTeamClient(teamId)

    teamClient && Game.get().sendFormPageToTeamClient(teamClient)
    Game.get().sendFormsToAdmins()
    this.save()
  }

  public goToNextFormPage(teamId: string): void {
    const currentPage = this.getFormPage(teamId)
    const nextPage = currentPage + 1

    this.setFormPage(teamId, nextPage)
  }

  public isFormSubmitted(teamId: string): boolean {
    return this.submittedForms.includes(teamId)
  }

  public setField(teamId: string, fieldId: string, value: FormFieldValue): void {
    console.log(colorize('[FormManager]', Fg.Blue), 'Setting form', teamId, fieldId, value);

    if (!this.forms[teamId]) {
      this.forms[teamId] = {}
    }

    this.forms[teamId][fieldId] = value

    const teamClient = Game.get().getTeamClient(teamId)

    this.save()
    teamClient && Game.get().sendFormToTeamClient(teamClient)
    Game.get().sendFormsToAdmins()
  }

  public clearAllForms(): void {
    this.forms = {}
    this.results = {}
    this.submittedForms = []
    this.formPage = {}

    this.save()
    Game.get().sendFormToTeamClient()
    Game.get().sendFormsToAdmins()
  }

  public clearForm(teamId: string): void {
    delete this.forms[teamId]
    this.submittedForms = this.submittedForms.filter((id) => id !== teamId)
    this.formPage[teamId] = 0

    const teamClient = Game.get().getTeamClient(teamId)

    this.save()
    teamClient && Game.get().sendFormToTeamClient(teamClient)
    teamClient && Game.get().sendFormPageToTeamClient(teamClient)
    Game.get().sendFormsToAdmins()
  }

  public submitForm(teamId: string): void {
    if (this.submittedForms.includes(teamId)) {
      return
    }

    this.submittedForms.push(teamId)

    if (this.getAllFormsSubmitted()) {
      this.allFormsSubmitted()
    }

    const teamClient = Game.get().getTeamClient(teamId)

    this.save()
    teamClient && Game.get().sendFormToTeamClient(teamClient)
    Game.get().sendFormsToAdmins()
  }

  public setSubmittedForm (teamId: string, submitted: boolean): void {
    if (submitted) {
      this.submitForm(teamId)
    } else {
      this.submittedForms = this.submittedForms.filter((id) => id !== teamId)

      const teamClient = Game.get().getTeamClient(teamId)

      this.save()
      teamClient && Game.get().sendFormToTeamClient(teamClient)
      Game.get().sendFormsToAdmins()
    }
  }

  public calculateResult(teamId: string): number {
    const teamForm = this.forms[teamId]

    if (!teamForm) {
      return 0
    }

    return Object.keys(teamForm)
      .map((fieldId) => {
        const field = teamForm[fieldId]
        const fieldTemplate = getFieldFromId(fieldId)

        if (!field) {
          console.error(colorize('[FormManager]', Fg.Blue), 'Field not found', fieldId)
          return 0
        }

        if (!fieldTemplate) {
          console.error(colorize('[FormManager]', Fg.Blue), 'Field template not found', fieldId)
          return 0
        }

        return getPoints(fieldTemplate, field)
      })
      .reduce((acc, points) => acc + points, 0)
  }

  public calculateResults() {
    this.results = Object.keys(this.forms)
      .reduce((acc, teamId) => {
        acc[teamId] = this.calculateResult(teamId)
        return acc
      }, {} as Record<string, number>)

    console.log(colorize('[FormManager]', Fg.Blue), 'Results', this.results)

    this.save()
    Game.get().sendResultsToBoard()
    Game.get().sendFormsToAdmins()
  }

  public getAllFormsSubmitted (): boolean {
    return Game.get().getTeams().filter(team => team.active).every(team => this.submittedForms.includes(team.id))
  }

  allFormsSubmittedListeners: (() => void)[] = []
  allFormsSubmitted () {
    this.allFormsSubmittedListeners.forEach(listener => listener())
  }
  onAllFormsSubmitted (listener: () => void) {
    this.allFormsSubmittedListeners.push(listener)
    return () => this.offAllFormsSubmitted(listener)
  }
  onceAllFormsSubmitted (listener: () => void) {
    const off = this.onAllFormsSubmitted(() => {
      off()
      listener()
    })
    return off
  }
  offAllFormsSubmitted (listener: () => void) {
    this.allFormsSubmittedListeners = this.allFormsSubmittedListeners.filter(l => l !== listener)
  }
}