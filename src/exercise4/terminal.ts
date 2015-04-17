///// <reference path="../../references.ts" />

module GameOfLife {
    export var blessed: Blessed = require('blessed');

    export class Terminal {
        private program: BlessedProgram;
        private screen: BlessedScreen;
        private box: BlessedBox;
        private refreshInterval: number = 500;
        private intervalId: number;

        constructor(blessed: Blessed) {
            this.initProgram(blessed);
            this.initScreen(blessed);
        }

        public startLoop() {
            this.intervalId = setInterval(this.refreshMethod.bind(this), this.refreshInterval);
        }

        public stopLoop() {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        public getIntervalId() {
            return this.intervalId;
        }

        public setRefreshRate(interval: number) {
            this.refreshInterval = interval;
        }

        public getRefreshRate() {
            return this.refreshInterval;
        }

        public setContent(content: string) {
            this.box.content = content;
        }

        public getContent() {
            return this.box.content;
        }

        public exit() {
            this.stopLoop();
            /* istanbul ignore else */
            if(this.program) {
                this.program.clear();
                this.program.showCursor();
                this.program.normalBuffer();
            }
            this.killProcess()
        }

        private initProgram(blessed) {
            this.program = blessed.program();
            this.program.key('q', this.quitCallback);
            this.program.clear();
        }

        /* istanbul ignore next */
        private quitCallback() {
            return (ch, key) => {
                this.exit()
            }
        }

        private initScreen(blessed) {
            this.screen = blessed.screen({
                program: this.program,
                autoPadding: true,
                smartCSR: true
            });
            this.screen.enableKeys();
            // this contains the initial content
            this.box = blessed.box({
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                content: '█',
                tags: true,
                style: {
                    fg: '#ffffff',
                    bg: '#ff0000'
                }
            });
            this.screen.append(this.box);
        }

        private refreshMethod() {
            this.screen.render();
        }

        private killProcess() {
            process.exit(0);
        }
    }
}



