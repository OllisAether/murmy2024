<template>
  <div class="calculator-app">
    <div class="calculator-app__display">
      <div
        :class="['calculator-app__display__input', {
          'calculator-app__display__input--error': error,
        }]"
      >
        <template v-if="error">{{ error }}</template>
        <template v-else>
          <template v-if="!equation.join(' ')">&nbsp;</template>
          {{ equation.join(' ') }}
        </template>
      </div>
      <div class="calculator-app__display__output">
        <template v-if="!result">&nbsp;</template>
        {{ result }}
      </div>
    </div>

    <div class="calculator-app__buttons">
      <div class="calculator-app__buttons__filler"/>
      <button
        class="calculator-app__buttons__button calculator-app__buttons__button--clear"
        @click="buttonClick('C')"
      >
        C
      </button>
      <button
        class="calculator-app__buttons__button calculator-app__buttons__button--backspace"
        @click="buttonClick('bs')"
      >
        <BackspaceSvg />
      </button>
      <button
        v-for="button in buttons"
        :key="button"
        @click="buttonClick(button)"
        :class="['calculator-app__buttons__button', {
          'calculator-app__buttons__button--operator': ['+', '-', '×', '÷'].includes(button),
          'calculator-app__buttons__button--equals': button === '=',
          'calculator-app__buttons__button--sign': button === '+/-',
          'calculator-app__buttons__button--period': button === '.',
          'calculator-app__buttons__button--parentheses': ['(', ')'].includes(button),
        }]"
      >
        {{ button }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BackspaceSvg from '@/assets/phone/backspace.svg';

const buttons = [
  '7', '8', '9', '÷', '(',
  '4', '5', '6', '×', ')',
  '1', '2', '3', '-', '=',
  '+/-', '0', '.', '+'
];

const error = ref<string | null>(null);
const equation = ref<string[]>([]);

const result = computed(() => {
  try {
    let sanitizedEquation = equation.value
      .map(part => {
        if (part.startsWith('.')) {
          return `0${part}`;
        }
        if (part.endsWith('.')) {
          return `${part}0`;
        }
        if (part.startsWith('-.')) {
          return `-0${part.slice(1)}`;
        }
        if (part.startsWith('-') && part.length > 1) {
          return `(${part})`;
        }

        if (!isNaN(parseFloat(part))) {
          return parseFloat(part.replace('.', ',')).toString();
        }

        return part;
      })
      .join('')
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

      
    // Remove any characters that aren't numbers, operators, or parentheses
    sanitizedEquation = sanitizedEquation.replace(/[^-()\d/*+.]/g, '');

    const result = eval(`function f() { return ${sanitizedEquation}; } f();`)
  
    if (isNaN(result)) {
      return null;
    }

    return result;
  } catch {
    return null;
  }
});

function buttonClick(button: string) {
  if (error.value) {
    error.value = null;
  }

  switch (button) {
    case 'C':
      equation.value = [];
      break;
    case '=':
      if (result.value !== null) {
        equation.value = [(result.value ?? '').toString()];
        break;
      }

      error.value = result.value === null ? 'Syntax Error' : null;
      equation.value = [];
      break;
    case 'bs':
      equation.value[equation.value.length - 1] = equation.value[equation.value.length - 1]?.slice(0, -1);

      if (equation.value[equation.value.length - 1] === '' || equation.value[equation.value.length - 1] === undefined) {
        equation.value = equation.value.slice(0, -1);
      }
      break;
    case '+/-':
      var last = equation.value[equation.value.length - 1];

      var number = parseFloat(last.replace('.', ','));

      if (isNaN(number)) {
        break;
      }

      equation.value[equation.value.length - 1] = `${-number}`
      break;
    case '+':
    case '-':
    case '×':
    case '÷':
      var last = equation.value[equation.value.length - 1];

      if (isNaN(parseFloat(last?.replace('.', ',')))) {
        equation.value = equation.value.slice(0, -1);
      }

      equation.value.push(button);
      break;

    case '.':
      var last = equation.value[equation.value.length - 1];

      if (!last.includes('.')) {
        equation.value[equation.value.length - 1] += '.';
      }
      break;
    default:
      var last = equation.value[equation.value.length - 1];

      if (last === undefined || isNaN(parseFloat(last.replace('.', ',')))) {
        equation.value.push(button);
      } else {
        equation.value[equation.value.length - 1] += button;
      }
      break;
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.calculator-app {
  background: #000;
  display: flex;
  flex-direction: column;
  height: 100%;

  &__display {
    flex-grow: 1;
    background: linear-gradient(#111, #000);
    color: #fff;
    padding: 10px * $scale;
    font-size: 20px * $scale;
    text-align: right;

    &__input {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      // min-height: 2em;
      padding: .5em 0;
      font-size: 16px * $scale;
      line-height: 1;
      word-break: break-all;
    }

    &__output {
      font-size: 10px * $scale;
      opacity: .5;
    }
  }

  &__buttons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;
    grid-auto-rows: 1fr;
    gap: 2px * $scale;
    padding: 2px * $scale;

    &__button, &__filler {
      background: linear-gradient(#333, #222);
      box-shadow:
        0 -.5px * $scale .5px * $scale .5px * $scale #0008 inset,
        0 2px * $scale .5px * $scale -1px * $scale #fff2 inset
      ;
    }

    &__filler {
      grid-column: span 3;
      background: linear-gradient(#111, #0a0a0a);
    }

    &__button {
      color: #fff;
      font-size: 16px * $scale;
      line-height: 2;

      &--operator, &--sign, &--period, &--equals, &--parentheses, &--backspace, &--clear {
        background: linear-gradient(#111, #0a0a0a);
      }

      &--clear {
        color: #f88;
      }

      &--equals {
        grid-row: span 2;
      }

      &:active {
        filter: brightness(2);
      }

      &--backspace, &--clear {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 12px * $scale;
        line-height: 1.6;

        svg {
          display: block;
          width: 18px * $scale;
        }
      }
    }
  }
}
</style>