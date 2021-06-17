import { Form } from '../types/types';

export function capitalize(prop: String): String {
    if(!prop) {
        return prop;
    }

    const user_prop: string = prop.trim().toLowerCase();
    let arrNames: Array<String> = user_prop.split(" ");

    arrNames = arrNames.map(name => {
        const temp = name;
        name = name[0].toUpperCase();
        name += temp.slice(1, temp.length);
        return name;
    });
    return arrNames.join(' ');
}

export function comparatorLastName(a: Form, b: Form): number {
    const lastname1: String = a.lastname;
    const lastname2: String = b.lastname;

    if (lastname1 < lastname2) {
        return -1;
    }
    if (lastname1 > lastname2) {
        return 1;
    }

    return 0;
}