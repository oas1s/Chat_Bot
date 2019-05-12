const { Bot, Keyboard } = require('node-vk-bot');

const bot = new Bot({
    token: 'f88aadf6125fcdc22cab65377efa93dde7abe7d452dd5d7e7883569494bbb3ce1d02e7d87394fd4513ef2',
    group_id: 181044309
}).start();


const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('chinook.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE  , (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});





let dz = ' ';
let messagesFromUser = ['', '', '', '', ''];

bot.get(/dzalgemshow/i, (msg, exec, reply) => {
    console.log(msg);
    if (dz === '') {
        reply('Ничего не записано 0_0')
    }  else {
        reply(dz.toString())
    }
});

bot.get(/dzalgemwrite/i, (msg, exec, reply) => {
    console.log(msg);
    dz = msg.text;
    // reply('Zapisano');
});

bot.on('command-notfound', msg => {
    for (let i = 0; i <4; i++) {
        messagesFromUser[i] = messagesFromUser[i+1];
    }
    messagesFromUser[4] = msg;


    let senderId = messagesFromUser[0].from_id;
    let counter = 0;
    for (let i = 0; i <5 ; i++) {
        if (senderId === messagesFromUser[i].from_id) {
            counter++;
        }
    }
    if (counter === 5) {

        let idOfFlooder = msg.from_id;
        let select = `SELECT id,warns FROM Warnings WHERE id = ?;`;

        db.get(select, [idOfFlooder.toString()], (err, row) => {
            if (err) {
                throw err;
            }
            if (row === undefined) {
                bot.send('Вам 1 предупреждение', msg.peer_id);
                console.log(typeof row);
                let insert = `INSERT INTO Warnings (id,warns) VALUES (? , 1)`;

                db.run(insert, [idOfFlooder.toString()], (err) => {
                    console.log(typeof row);
                    if (err) {
                        throw err;
                    }
                    console.log(`Rows inserted ${this.changes}`);
                });
            }
            else {
                let update = `UPDATE Warnings SET warns = ? WHERE id = ?`;

                if (row.warns >= 2){
                    bot.send('Вы достигли предела предупреждений, бб гг вп', msg.peer_id);
                    row.warns = -1;
                    setTimeout(function () {
                        bot.api('messages.removeChatUser', {chat_id:msg.peer_id-2000000000, user_id:idOfFlooder}).then(res => {
                            console.log(res);
                        }).catch(err => {
                            console.log(err);
                        });
                    },200);
                } else {
                    bot.send('Вам ' + (row.warns+1) + ' предупреждение', msg.peer_id);
                }

                db.run(update, [row.warns+1,idOfFlooder], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                });
            }

        });
        messagesFromUser = ['', '', '', '', ''];
    }
    counter = 0;
    console.log(msg);
});

let happyString = 'Ничего не задали!'

let Algem = happyString
let Matan = happyString
let ASD = happyString
let Infa = happyString
let Discra = happyString

bot.get(/Дз алгем /i, (message, exec, reply) => {
    Algem = (message.text)
    reply('Записал')
})

bot.get(/Что по алгему/i, (message, exec, reply) => {
    reply(Algem.toString().slice(1))
})


bot.get(/Дз матан /i, (message, exec, reply) => {
    Matan = (message.text)
    reply('Записал')
})

bot.get(/Что по матану/i, (message, exec, reply) => {
    reply(Matan.toString().slice(1))
})


bot.get(/Дз АиСД /i, (message, exec, reply) => {
    ASD = (message.text)
    reply('Записал')
})

bot.get(/Что по АиСДу/i, (message, exec, reply) => {
    reply(ASD.toString().slice(1))
})


bot.get(/Дз инфа /i, (message, exec, reply) => {
    Infa = (message.text)
    reply('Записал')
})

bot.get(/Что по инфе/i, (message, exec, reply) => {
    reply(Infa.toString().slice(1))
})


bot.get(/Дз дискра /i, (message, exec, reply) => {
    Discra = (message.text)
    reply('Записал')
})

bot.get(/Что по дискре/i, (message, exec, reply) => {
    reply(Discra.toString().slice(1))
})


