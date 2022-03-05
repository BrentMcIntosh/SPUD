"use strict";

export class Interpolator {

    static interpolate(template, data) {

        for (let key in data) {

            let reg = new RegExp("{{" + key + "}}", "g");

            let value = data[key];

            if (!value) {
                value = "";
            }

            template = template.replace(reg, value);
        }

        return template;
    }


    static interpolateImages(template, data, images) {

        template = Interpolator.interpolate(template, data);

        for (let image of images) {
            template = template.replace("/images/" + image + ".png", data[image]);
        }

        return template;
    }

    static docToJson(thing, doc) {

        for (let key in thing) {

            let element = doc.getElementById(key);

            if (element) {
                thing[key] = element.value;
            }
            else if (key.endsWith("Id")) {

                let test = parseInt(thing[key]);

                if (!test) {
                    thing[key] = 0;
                }
            }
        }

        return JSON.stringify(thing);
    }

    static dataToClass(thing, data) {

        for (let key in thing) {

            let id = key.toLowerCase();

            let value = data[id];

            if (value) {
                thing[key] = value;
            }
        }

        return thing;
    }
}
