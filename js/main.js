'use strict';

const task = `Завдання: зробити функцію, яка приймає текст у форматі CSV, а повертає функцію, 
яка прийматиме на вхід будь-який текст, та замінюватиме в ньому назви міст на рядок виду:<br/> 
"назва міста" (Х місце в ТОП-10 найбільших міст України, населення УУУУУУ людина/людини/людей)".`;
const taskParagraf = document.createElement('p');
taskParagraf.innerHTML = task;
document.body.appendChild(taskParagraf);

const cvsDexcription = `У рядку у форматі CSV, у перших двох колонках вказані координати (x, y), 
далі назва міста, а потім населення цього міста, через кому. 
Також можуть зустрічатися порожні рядки або коментарі (рядки, що починаються з #).<br/>
<br/>
Приклад CSV:<br/>
<br/>
48.30,32.16,Кропивницький,200000,<br/>
44.38,34.33,Алушта,31440,<br/>
49.46,30.17,Біла Церква,200131,<br/>
49.54,28.49,Бердичів,87575,#некоммент<br/>
<br/>
#<br/>
46.49,36.58,#Бердянськ,121692,<br/>
49.15,28.41,Вінниця,356665,<br/>
#45.40,34.29,Джанкой,43343,<br/>
<br/>
# в цьому файлі три рядки-коментаря :)`;
const cvsDexcriptionParagraf = document.createElement('p');
cvsDexcriptionParagraf.innerHTML = cvsDexcription;
document.body.appendChild(cvsDexcriptionParagraf);

const csvInputHeader = document.createElement('h2');
csvInputHeader.innerHTML = 'Місце для CSV';
document.body.appendChild(csvInputHeader);

const csvInputArea = document.createElement('textarea');
document.body.appendChild(csvInputArea);

const csvLoadButton = document.createElement('button');
csvLoadButton.textContent = 'Завантажити CSV';
document.body.appendChild(csvLoadButton);

const textInputHeader = document.createElement('h2');
textInputHeader.innerHTML = 'Місце для вводу тексту';
document.body.appendChild(textInputHeader);

const textInputArea = document.createElement('textarea');
document.body.appendChild(textInputArea);

const submitButton = document.createElement('button');
submitButton.textContent = 'Обробити текст';
document.body.appendChild(submitButton);

const resultHeader = document.createElement('h2');
resultHeader.innerHTML = 'Результат обробки';
document.body.appendChild(resultHeader);

const resultTextArea = document.createElement('textarea');
resultTextArea.readOnly = true;
document.body.appendChild(resultTextArea);

let parseCityLine = (line) => {
    let values = line.split(',');
    return {
        'x': values[0],
        'y': values[1],
        'name': values[2],
        'population': values[3]
    }
}

let createCityDescription = (name, rating, population) => {
    let people = population % 10 === 1
        ? 'людина'
        : [2, 3, 4].includes(population % 10)
            ? 'людини'
            : 'людей';
    return `${name} (${rating} місце в ТОП-10 найбільших міст України, населення ${population} ${people})`;
}

let createCityReplacer = (csv) => {
    let cities =
        csv
            .split("\n")
            .filter(l => /^\d{2}\.\d{2}\,\d{2}\.\d{2}\,.+\,\d+\,.*/.test(l))
            .map(parseCityLine)
            .sort((a, b) => b.population - a.population)
            .slice(0, 10)
            .reduce((a, c, i) => ((a[c.name] = { 'population': c.population, 'rating': i + 1 }), a), {});

    return (text) => {
        Object
            .keys(cities)
            .forEach(c => text = text.replaceAll(c, createCityDescription(c, cities[c].rating, cities[c].population)));
        return text;
    }
}

let cityReplacer = createCityReplacer('');
csvLoadButton.onclick = () => cityReplacer = createCityReplacer(csvInputArea.value);
submitButton.onclick = () => resultTextArea.value = cityReplacer(textInputArea.value);


