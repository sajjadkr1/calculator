import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  operation = '+';
  number1 = '';
  number2 = '';
  currentNumber = 'number1';

  result = 0;
  error = '';
  calculated = false;
  hasNumber2 = false;

  history: string[] = [];

  formatResult(): string {
    return this.result.toLocaleString('en-US', {
      maximumFractionDigits: 10
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {

    if (event.key >= '0' && event.key <= '9') {
      this.addNumber(Number(event.key));
      return;
    }

    switch (event.key) {

      case '.':
        this.addDecimal();
        break;

      case '+':
        this.selectOperation('+');
        break;

      case '-':
        this.selectOperation('-');
        break;

      case '*':
        this.selectOperation('*');
        break;

      case '/':
        this.selectOperation('/');
        break;

      case 'Enter':
        this.calculate();
        break;

      case 'Backspace':
        this.backspace();
        break;

      case 'Escape':
        this.clear();
        break;
    }
  }

  addNumber(number: number) {

    if (this.calculated) {
      this.number1 = number.toString();
      this.number2 = '';
      this.result = 0;
      this.currentNumber = 'number1';
      this.calculated = false;
      this.error = '';
      return;
    }

    if (this.currentNumber === 'number1') {
      this.number1 += number.toString();
    } else {
      this.number2 += number.toString();
      this.hasNumber2 = true;
    }
  }

  addDecimal() {

    if (this.currentNumber === 'number1') {

      if (!this.number1.includes('.')) {
        this.number1 =
          this.number1 === ''
            ? '0.'
            : this.number1 + '.';
      }

    } else {

      if (!this.number2.includes('.')) {
        this.number2 =
          this.number2 === ''
            ? '0.'
            : this.number2 + '.';
      }
    }
  }

  backspace() {

    if (this.currentNumber === 'number1') {
      this.number1 = this.number1.slice(0, -1);
    } else {
      this.number2 = this.number2.slice(0, -1);
    }
  }

  changeSign() {

    if (this.currentNumber === 'number1') {

      if (this.number1.startsWith('-')) {
        this.number1 = this.number1.slice(1);
      } else {
        this.number1 = '-' + this.number1;
      }

    } else {

      if (this.number2.startsWith('-')) {
        this.number2 = this.number2.slice(1);
      } else {
        this.number2 = '-' + this.number2;
      }
    }
  }

  percentage() {

    if (this.currentNumber === 'number1') {
      this.number1 =
        (Number(this.number1) / 100).toString();
    } else {
      this.number2 =
        (Number(this.number2) / 100).toString();
    }
  }

  selectOperation(operation: string) {

    if (this.calculated) {
      this.number1 = this.result.toString();
      this.number2 = '';
      this.calculated = false;
      this.error = '';
    }

    this.operation = operation;
    this.currentNumber = 'number2';
    this.hasNumber2 = false;
  }

  calculate() {

    this.error = '';

    if (this.number1 === '') {
      this.error = 'Veuillez entrer le premier nombre';
      return;
    }

    if (!this.hasNumber2 || this.number2 === '') {
      this.error = 'Veuillez entrer le deuxième nombre';
      return;
    }

    const num1 = Number(this.number1);
    const num2 = Number(this.number2);

    switch (this.operation) {

      case '+':
        this.result = num1 + num2;
        break;

      case '-':
        this.result = num1 - num2;
        break;

      case '*':
        this.result = num1 * num2;
        break;

      case '/':

        if (num2 === 0) {
          this.error = 'Impossible de diviser par zéro';
          this.result = 0;
          return;
        }

        this.result = num1 / num2;
        break;
    }

    this.history.unshift(
      `${this.number1} ${this.operation} ${this.number2} = ${this.result}`
    );

    if (this.history.length > 2) {
      this.history.pop();
    }

    this.calculated = true;
  }

  clear() {

    this.number1 = '';
    this.number2 = '';
    this.result = 0;
    this.operation = '+';
    this.error = '';
    this.calculated = false;
    this.currentNumber = 'number1';
    this.hasNumber2 = false;
  }

  clearHistory() {
    this.history = [];
  }
}