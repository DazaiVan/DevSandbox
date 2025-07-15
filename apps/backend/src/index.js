"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
var port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api', function (req, res) {
    res.json({ message: 'Hello from backend!' });
});
app.listen(port, function () {
    console.log("Backend server running at http://localhost:".concat(port));
});
