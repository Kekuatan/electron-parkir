
const path = require("path");
var pathToFfmpeg = require('ffmpeg-static');

const shell = require('any-shell-escape')
const {exec} = require('child_process')
console.log(pathToFfmpeg);

// process.exit(1)

class CaptureImageService {
    constructor() {
        this.oneCaptureButDelay = [
            pathToFfmpeg,
            // '-ss', '1',
            // 'error',

            '-i', 'rtsp://admin:admin@192.168.110.51:554',
            // '-q:v', '4',
            '-frames:v', '1', '-q:v', '2',
            '-strftime','1',
            path.join('Z:', '%Y-%m-%d_%H-%M-%S.jpg'),
        ]

        this.continueCapturePerSecond  = [
            pathToFfmpeg,
            '-y',
            '-i',  'rtsp://admin:admin@192.168.110.51',
            '-vf',
            'fps=1',
            '-loglevel', 'quiet',
            '-strftime', '1',
            '%S.jpg'
        ]

        this.makeMp3 = shell(this.continueCapturePerSecond)
    }

    takeImage(){
        exec(this.makeMp3, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            } else {
                console.info('done!')
            }
        })
    }
}

// now we export the class, so other modules can create Cat objects
module.exports = {
    CaptureImageService: new CaptureImageService()
}
