export const codeRegex = /^[A-Z0-9]+$/;
export const codeLength = 4;
export const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function validateCode (code: string) {
  if (!codeRegex.test(code)) {
    return {
      valid: false,
      message: 'Code muss aus Großbuchstaben und Zahlen bestehen (A-Z, 0-9)'
    }
  }

  if (code.length !== codeLength) {
    return {
      valid: false,
      message: `Code muss genau ${codeLength} Zeichen lang sein`
    }
  }

  return {
    valid: true
  }
}

export function generateCode () {
  let code = '';

  for (let i = 0; i < codeLength; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}