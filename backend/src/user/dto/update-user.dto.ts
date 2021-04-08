import { IsString, IsEmail, MinLength, Validate } from 'class-validator';
import { ContainsSpecialCharacter } from 'src/shared/validators/contain-special-character.validator';

export class UpdateUserDTO {
  @IsString({
    message: 'Field name required',
  })
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString({
    message: 'Field Password required',
  })
  @MinLength(5, {
    message: 'Password is too short',
  })
  @Validate(ContainsSpecialCharacter)
  readonly password: string;
}
