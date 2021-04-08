import { IsString, IsEmail, MinLength, Validate, IsDefined } from 'class-validator';
import { ContainsSpecialCharacter } from 'src/shared/validators/contain-special-character.validator';

export class CreateUserDTO {
  @IsDefined()
  @IsString()
  readonly name: string;

  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsString()
  @MinLength(5, {
    message: 'Password is too short',
  })
  @Validate(ContainsSpecialCharacter)
  readonly password: string;
}
