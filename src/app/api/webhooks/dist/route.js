"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.POST = void 0;
var svix_1 = require("svix");
var headers_1 = require("next/headers");
var db_1 = require("@/db");
var schema_1 = require("@/schema");
function POST(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var SIGNING_SECRET, wh, headerPayload, svix_id, svix_timestamp, svix_signature, payload, body, evt, id, eventType, userData, primaryEmailAddressId_1, primaryEmail, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    SIGNING_SECRET = process.env.SIGNING_SECRET;
                    if (!SIGNING_SECRET) {
                        throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
                    }
                    wh = new svix_1.Webhook(SIGNING_SECRET);
                    return [4 /*yield*/, headers_1.headers()];
                case 1:
                    headerPayload = _b.sent();
                    svix_id = headerPayload.get("svix-id");
                    svix_timestamp = headerPayload.get("svix-timestamp");
                    svix_signature = headerPayload.get("svix-signature");
                    // If there are no headers, error out
                    if (!svix_id || !svix_timestamp || !svix_signature) {
                        return [2 /*return*/, new Response("Error: Missing Svix headers", {
                                status: 400
                            })];
                    }
                    return [4 /*yield*/, req.json()];
                case 2:
                    payload = _b.sent();
                    body = JSON.stringify(payload);
                    // Verify payload with headers
                    try {
                        evt = wh.verify(body, {
                            "svix-id": svix_id,
                            "svix-timestamp": svix_timestamp,
                            "svix-signature": svix_signature
                        });
                    }
                    catch (err) {
                        console.error("Error: Could not verify webhook:", err);
                        return [2 /*return*/, new Response("Error: Verification error", {
                                status: 400
                            })];
                    }
                    id = evt.data.id;
                    eventType = evt.type;
                    console.log("Received webhook with ID " + id + " and event type of " + eventType);
                    console.log("Webhook payload:", body);
                    if (!(eventType === "user.created")) return [3 /*break*/, 6];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    userData = evt.data;
                    primaryEmailAddressId_1 = userData.primary_email_address_id;
                    primaryEmail = (_a = userData.email_addresses.find(function (email) { return email.id === primaryEmailAddressId_1; })) === null || _a === void 0 ? void 0 : _a.email_address;
                    if (!primaryEmail) {
                        throw new Error("No primary email found for user");
                    }
                    // Insert the user into the database
                    return [4 /*yield*/, db_1.db.insert(schema_1.usersTable).values({
                            id: userData.id,
                            name: ((userData.first_name || "") + " " + (userData.last_name || "")).trim(),
                            email: primaryEmail
                        })];
                case 4:
                    // Insert the user into the database
                    _b.sent();
                    console.log("Successfully created user in database:", userData.id);
                    return [2 /*return*/, new Response("User created successfully", { status: 201 })];
                case 5:
                    error_1 = _b.sent();
                    console.error("Error creating user in database:", error_1);
                    return [2 /*return*/, new Response("Error creating user", { status: 500 })];
                case 6: return [2 /*return*/, new Response("Webhook received", { status: 200 })];
            }
        });
    });
}
exports.POST = POST;
