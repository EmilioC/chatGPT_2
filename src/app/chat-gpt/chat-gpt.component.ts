import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { Configuration, OpenAIApi, } from 'openai';
import { ChatWithBot, ResponseModel } from '../models/gpt-response';
import { gptModels } from '../models/constants';


@Component({
  selector: 'app-chat-gpt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-gpt.component.html',
  styleUrl: './chat-gpt.component.css'
})
export class ChatGPTComponent {

  chatConversation: ChatWithBot[] = [];
  response!: ResponseModel;
  responseTurbo!: any;
  gptModels = gptModels;
  promptText = '';
  roleSystem: string = 'system';
  roleUser: string = 'user'
  promptTextModificado = ', responde con mucho humor, añade a tu respuesta, combinaciones de las palabras de la siguiente frase:'
  showSpinner = false;
  messages: string[] = [];
  temperature: number = 0;
  isRecording: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  fraseAleatoria(array: string[]) {
    const indice = Math.floor(Math.random() * array.length);
    return array[indice];
  }

  checkResponse() {
    this.pushChatContent(this.promptText, 'Fistro pecador', 'person');
    this.invokeGPT();
    this.promptText = '';
  }

  pushChatContent(content: string, person: string, cssClass: string) {
    const chatToPush: ChatWithBot = { person: person, response: content, cssClass: cssClass };
    this.chatConversation.unshift(chatToPush);
  }

  /* INICIO MODIFICADO PARA gpt-3.5-turbo */

  pushChatContentTurbo(content: string, person: any, cssClass: string) {
    const chatToPush = { response: content, person: person, cssClass: cssClass };
    this.chatConversation.unshift(chatToPush);
  }

  checkResponseTurbo() {
    this.pushChatContentTurbo(this.promptText, 'Fistro pecador', 'person');
    this.invokeGPT();
    this.promptText = '';
  }
  /*  FIN MODIFICADO PARA gpt-3.5-turbo */

  getText(data: string) {
    /* console.log(data); */
    return data.split('\n').filter(f => f.length > 0);

  }

  async invokeGPT() {

    if (this.promptText.length < 2)
      return;
    try {
      this.response = undefined;
      let configuration = new Configuration({ apiKey: environment.apiKey });
      let openai = new OpenAIApi(configuration);

      /*       let requestData={
              model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
              prompt: this.promptTextModificado + this.fraseAleatoria(frasesChiquito) + this.promptText,//this.generatePrompt(animal),
              temperature: 0.95,
              max_tokens: 100,
              top_p: 1.0,
              frequency_penalty: 0.0,
              presence_penalty: 0.0,
            };

                  this.showSpinner = true;
            let apiResponse =  await openai.createCompletion(requestData);

            this.response = apiResponse.data as ResponseModel;
            this.pushChatContent(this.response.choices[0].text.trim(),'ChiquiTronic','bot');
       */
      /* INICIO MODIFICADO PARA gpt-3.5-turbo */
      this.showSpinner = true;
      let apiResponse = await openai.createChatCompletion(
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { 'role': 'system', content: "eres un humorista" },
            { 'role': 'user', content: this.promptText + this.promptTextModificado + this.fraseAleatoria(frasesChiquito_1) }
          ]
          ,
          temperature: 1
        }
      )

      this.response = apiResponse.data as ResponseModel;
      /* console.log(this.responseTurbo); */
      this.responseTurbo = this.response.choices;

      /*  console.log(this.responseTurbo[0].message.content); */
      this.pushChatContent(this.responseTurbo[0].message.content, 'ChiquiTronic', 'bot');
      /* FIN MODIFICADO PARA gpt-3.5-turbo */
      this.hablar(this.responseTurbo[0].message.content);
      this.showSpinner = false;

    } catch (error: any) {
      this.showSpinner = false;
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        this.pushChatContent("Madre mía ¡¡ los cien caballos de bonanza se me han escapao ¡¡", 'ChiquiTronic', 'bot');

      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);

      }
    }
  }

  rabbitState: string = '';

  startAnimation() {
    this.rabbitState = 'running';
    setTimeout(() => {
      this.rabbitState = 'love';
      setTimeout(() => {
        this.rabbitState = '';
      }, 500);
    }, 2000);
  }

  hablar(texto: string): void {

    const sintesis = window.speechSynthesis;
    const mensaje = new
      SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-ES';
    sintesis.speak(mensaje);
  }


  /*   escuchar(): void {
      const reconocimiento = new (window as any).webkitSpeechRecognition();
      reconocimiento.lang = 'es-ES';
      reconocimiento.onresult = (event: any) => {
        this.promptText = event.results[0][0].transcript;
      };
      reconocimiento.start();
    } */

  /*   escuchar(): void {
      console.log("*** Activado escuchar() ***");
      const reconocimiento = new (window as any).webkitSpeechRecognition();
      reconocimiento.lang = 'es-ES';
      let timeout: ReturnType<typeof setTimeout>;

      reconocimiento.onresult = (event: any) => {
        clearTimeout(timeout);
        this.promptText = event.results[0][0].transcript;
        timeout = setTimeout(() => {
          reconocimiento.stop();
        }, 0.6);
      };

      reconocimiento.onspeechend = () => {
        clearTimeout(timeout);
        this.isRecording = false;
        reconocimiento.stop();
      };

      console.log(this.promptText);
      this.isRecording = true;
      reconocimiento.start();
      console.log("*** desactivado escuchar() ***");
      console.log("PromptText", this.promptText);
      this.checkResponse();

    } */

  escuchar(): void {
    this.promptText = '';
    console.log("*** Activado escuchar() ***");
    const reconocimiento = new (window as any).webkitSpeechRecognition();
    reconocimiento.lang = 'es-ES';
    let timeout: ReturnType<typeof setTimeout>;

    reconocimiento.onresult = (event: any) => {
      clearTimeout(timeout);
      this.promptText = event.results[0][0].transcript;
      timeout = setTimeout(() => {
        /* reconocimiento.stop(); */
        reconocimiento.stop();
      }, 2000);

      console.log("***", this.promptText);
      console.log("*** FIN escuchar() ***");
      this.pushChatContent(this.promptText, 'ChiquiTronic', 'bot');

      this.invokeGPT();
    };
    reconocimiento.start();


  }
}

