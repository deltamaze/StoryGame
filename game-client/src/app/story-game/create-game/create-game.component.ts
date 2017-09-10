import { Component, OnInit } from '@angular/core';
import { StoryGameService, GameRoom } from '../story-game.service';
import {FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl  } from '@angular/forms';
import {Utils} from '../../shared/utils'
@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  private newGame: GameRoom = new GameRoom();
  public createNewGame: FormGroup;
  private status: string;

  constructor(private gameService: StoryGameService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.gameService.getErrorStatus().subscribe(status => this.status = status);

    this.createNewGame = this.fb.group({
      gameName: [' ', [Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      isPrivate: [false, []],
      maxPlayers: [8, [Validators.required, Utils.minValue(3),Utils.maxValue(8)]],
      timeBetweenTurns: [30, [Validators.required, Utils.minValue(5),Utils.maxValue(60)]],
      totalRounds: [15, [Validators.required,Utils.minValue(5),Utils.maxValue(30)]],
      storyThusFar: ['Once upon a time ...', [Validators.required, Validators.minLength(5), ,Validators.maxLength(200)]],
      timestamp: [null]
    });
  }

  onSubmit({ value }: { value: GameRoom, valid: boolean }) {

    
    this.gameService.clearError(); //Clear Server Error
    this.gameService.createGame(value);
  }

  private navHome(): void {
    this.gameService.navHome();
  }


}
