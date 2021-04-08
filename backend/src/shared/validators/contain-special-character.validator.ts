import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'specialCharacter', async: false })
export class ContainsSpecialCharacter implements ValidatorConstraintInterface {
  public validate(text: string): boolean {
    if (!text) {
      return false;
    }

    return !!text.toString().match(/[^a-zA-Zа-яА-Я0-9\-'_]/);
  }

  public defaultMessage() {
    return 'Filed must contain special character!';
  }
}
