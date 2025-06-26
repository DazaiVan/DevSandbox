import {makeAutoObservable} from 'mobx';

export class ThemeStore {


    private readonly themes = {


         lightTheme: {
             '--bg-primary': '#ffffff',
             '--bg-secondary': '#f5f5f5',
             '--text-primary': '#000000',
             '--text-secondary': '#666666',
             '--border-color': '#d9d9d9',
             '--canvas-bg': '#ffffff',
         },

         darkTheme: {
            '--bg-primary': '#141414',
            '--bg-secondary': '#1f1f1f',
            '--text-primary': '#ffffff',
            '--text-secondary': '#a6a6a6',
            '--border-color': '#434343',
            '--canvas-bg': '#000000',
        }
    }

    private systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    private currentTheme: 'dark' | 'light' = this.systemTheme as 'dark' | 'light';

    setTheme(theme: 'dark' | 'light' | 'system') {
        if (theme === 'system') this.currentTheme = this.systemTheme as 'dark' | 'light';
        else this.currentTheme = theme;
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    private applyTheme() {
        const html = document.querySelector('html')!;
        const themeStyle = this.getThemeStyle;
        
        for (const [key, value] of Object.entries(themeStyle)) {
            html.style.setProperty(key, value);
        }
        
        html.setAttribute('data-theme', this.currentTheme);
    }

    get getTheme () {
        return this.currentTheme;
    }

    get getCurrentTheme () {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
       switch(savedTheme) {
        case 'dark':
            return 2;
        case 'light':
            return 1;
       }
    }

    get getThemeStyle(): object {
        switch(this.currentTheme) {
            case 'dark':
                return this.themes.darkTheme;
            case 'light':
                return this.themes.lightTheme;
            default:
                console.warn('Unknown theme:', this.currentTheme);
                return this.themes.lightTheme;
        }
    }

    init () {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        console.log(savedTheme);
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        this.applyTheme();
    }

    constructor() {
        makeAutoObservable(this);
    }

}
