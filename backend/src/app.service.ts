import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return /*html*/ `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
    </head>
    <body>
      <h1 style="color: green;"> Deploy Success 😃</h1>
    </body>
    </html>`;
  }
}
