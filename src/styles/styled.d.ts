import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;

    colors: {
      primary: string;

      backgroud: string;
      primaryText: string;
      secundaryText: string;
      others: string;
    };
  }
}
