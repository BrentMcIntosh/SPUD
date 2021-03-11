'use strict';

export class Interpolator {

    interpolate(template, data) {

        for (var key in data) {

            var reg = new RegExp('{{' + key + '}}', 'g');

            var value = data[key];

            if (!value) {
                value = "";
            }

            template = template.replace(reg, value);
        }

        return template;
    }

    docToJson(thing, doc) {

        for (var key in thing) {

            let element = doc.getElementById(key);

            if (element) {
                thing[key] = element.value;
            }
        }

        return JSON.stringify(thing);
    }

    dataToClass(thing, data) {

        for (var key in thing) {

            var id = key.toLowerCase();

            var value = data[id];

            if (value) {
                thing[key] = value;
            }
        }

        return thing;
    }
}