"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var pino_1 = __importDefault(require("pino"));
var configuration_master_1 = __importDefault(require("configuration-master"));
var getPiiFilter = function (redactPrefix, key) {
    var piiFilter = redactPrefix.map(function (data) { return "" + data + key; });
    piiFilter.push(key);
    return piiFilter;
};
//create logger instance
exports.logger = function (children) {
    //Get the sensitive keys from configuration file to redact
    var service = configuration_master_1.default.serviceName || 'micro service';
    var redactPrefix = configuration_master_1.default.logging.redactPrefix || ['request[*].'];
    var redactRemove = configuration_master_1.default.logging.redactRemove || false;
    var piiKeys = configuration_master_1.default.logging.piiFilter.map(function (key) {
        return getPiiFilter(redactPrefix, key.toLowerCase());
    });
    var redact = {
        paths: piiKeys.flat(),
        censor: function (value) { return "*".repeat(value.length); },
        remove: redactRemove
    };
    var baseLogger = pino_1.default({
        redact: redact,
        formatters: {
            level: function (level, number) { return ({ level: level }); }
        },
        messageKey: "message",
        level: configuration_master_1.default.logging.level.toLowerCase()
    });
    return children == null ? baseLogger.child({ id: "server generated log", service: service }) : baseLogger.child(__assign(__assign({}, children), { service: service }));
};
//# sourceMappingURL=index.js.map