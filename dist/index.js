"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 5000;
const jsonMiddleware = express_1.default.json();
app.use(jsonMiddleware);
const allResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
let videosDB = [
    {
        id: 1,
        title: 'video1',
        author: 'author1',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        get publicationDate() {
            return new Date(Date.parse(this.createdAt) + 24 * 60 * 60 * 1000).toISOString();
        },
        availableResolutions: ['P144', 'P360'],
    },
    {
        id: 2,
        title: 'video2',
        author: 'author2',
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: new Date().toISOString(),
        get publicationDate() {
            return new Date(Date.parse(this.createdAt) + 24 * 60 * 60 * 1000).toISOString();
        },
        availableResolutions: ['P144', 'P480'],
    },
    {
        id: 3,
        title: 'video3',
        author: 'author3',
        canBeDownloaded: false,
        minAgeRestriction: 5,
        createdAt: new Date().toISOString(),
        get publicationDate() {
            return new Date(Date.parse(this.createdAt) + 24 * 60 * 60 * 1000).toISOString();
        },
        availableResolutions: ['P144', 'P360', 'P720'],
    },
];
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// get all videos
app.get('/videos', (req, res) => {
    const allVideos = videosDB;
    res.send(allVideos);
});
const getErrorMessage = (message, field) => {
    return {
        message,
        field,
    };
};
// create new video
app.post('/videos', (req, res) => {
    var _a;
    const errors = {};
    errors.errorsMessages = [];
    let isError = false;
    if (!req.body.title || req.body.title.length > 40) {
        errors.errorsMessages.push(getErrorMessage('Missing title or title length greater than 40 characters', 'title'));
        isError = true;
    }
    if (!req.body.author || req.body.author.length > 20) {
        errors.errorsMessages.push(getErrorMessage('Missing author or author length greater than 20 characters', 'author'));
        isError = true;
    }
    if ((req.body.availableResolutions &&
        !req.body.availableResolutions.every((element) => allResolutions.includes(element))) ||
        (req.body.availableResolutions && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.availableResolutions.length) === 0)) {
        errors.errorsMessages.push(getErrorMessage('No resolution provided or incorrect resolutions provided', 'availableResolutions'));
        isError = true;
    }
    if (isError) {
        res.status(400).send(errors);
        return;
    }
    const newVideo = {
        id: new Date().valueOf(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded || false,
        minAgeRestriction: +req.body.minAgeRestriction || null,
        createdAt: new Date().toISOString(),
        get publicationDate() {
            return new Date(Date.parse(this.createdAt) + 24 * 60 * 60 * 1000).toISOString();
        },
        availableResolutions: req.body.availableResolutions,
    };
    videosDB.push(newVideo);
    res.status(201).send(newVideo);
});
// get video by it's ID
app.get('/videos/:id', (req, res) => {
    const foundVideo = videosDB.find((v) => v.id === +req.params.id);
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    }
    res.send(foundVideo);
});
// Update existing video by ID
app.put('/videos/:id', (req, res) => {
    var _a;
    let videoToUpdate = videosDB.find((v) => v.id === +req.params.id);
    if (!videoToUpdate) {
        res.sendStatus(404);
        return;
    }
    const errors = {};
    errors.errorsMessages = [];
    let isError = false;
    if (!req.body.title || req.body.title.length > 40) {
        errors.errorsMessages.push(getErrorMessage('Missing title or title length greater than 40 characters', 'title'));
        isError = true;
    }
    if (!req.body.author || req.body.author.length > 20) {
        errors.errorsMessages.push(getErrorMessage('Missing author or author length greater than 20 characters', 'author'));
        isError = true;
    }
    if ((req.body.availableResolutions &&
        !req.body.availableResolutions.every((element) => allResolutions.includes(element))) ||
        (req.body.availableResolutions && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.availableResolutions.length) === 0)) {
        errors.errorsMessages.push(getErrorMessage('No resolution provided or incorrect resolutions provided', 'availableResolutions'));
        isError = true;
    }
    if (typeof req.body.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push(getErrorMessage('Incorrect canBeDownloaded value type', 'canBeDownloaded'));
    }
    if (+req.body.minAgeRestriction > 18 || +req.body.minAgeRestriction < 1) {
        errors.errorsMessages.push(getErrorMessage('Age should be null or between 1 and 18', 'minAgeRestriction'));
        isError = true;
    }
    if (req.body.publicationDate) {
        const regex = /^[1-9]\d{3}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/g;
        if (isNaN(Date.parse(req.body.publicationDate)) || !regex.test(req.body.publicationDate)) {
            errors.errorsMessages.push(getErrorMessage('Incorrect date format', 'publicationDate'));
            isError = true;
        }
    }
    console.log(new Date(Date.parse(req.body.publicationDate)));
    if (isError) {
        res.status(400).send(errors);
        return;
    }
    const indexToChange = videosDB.findIndex((el) => el.id === +req.params.id);
    videosDB[indexToChange] = Object.assign(Object.assign({}, videoToUpdate), req.body);
    console.log(videosDB);
    res.sendStatus(204);
});
// Delete video by ID
app.delete('/videos/:id', (req, res) => {
    let videoToDelete = videosDB.find((v) => v.id === +req.params.id);
    if (!videoToDelete) {
        res.sendStatus(404);
        return;
    }
    videosDB = videosDB.filter((el) => el.id !== +req.params.id);
    res.sendStatus(204);
});
// Testing. DELETE all data
app.delete('/videos/testing/all-data', (req, res) => {
    videosDB.length = 0;
    console.log(videosDB);
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
