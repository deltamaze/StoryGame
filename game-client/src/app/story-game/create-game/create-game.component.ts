import { Component, OnInit } from '@angular/core';
import { StoryGameService } from '../story-game.service';
import {FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl  } from '@angular/forms';
import {Utils} from '../../shared/utils';
@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  public createNewGame: FormGroup;
  public status: string;

  constructor(public gameService: StoryGameService,
              public fb: FormBuilder) { }

  ngOnInit() {
    this.gameService.getErrorStatus().subscribe(status => this.status = status);

    this.createNewGame = this.fb.group({
      gameName: [' ', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      isPrivate: [false, []],
      maxPlayers: [8, [Validators.required, Utils.minValue(3), Utils.maxValue(8)]],
      timeBetweenTurns: [40, [Validators.required, Utils.minValue(5), Utils.maxValue(120)]],
      totalRounds: [7, [Validators.required, Utils.minValue(5), Utils.maxValue(30)]],
      storyThusFar: ['Once upon a time,',
        [Validators.required, Validators.minLength(5), Validators.minLength(3),
          Validators.maxLength(200)]],
      timestamp: [null]
    });
  }

  onSubmit({ value }: { value: any, valid: boolean }) {

    this.gameService.clearError(); // Clear Server Error
    this.gameService.createGame(value);
  }

  public navHome(): void {
    this.gameService.navHome();
  }


}
