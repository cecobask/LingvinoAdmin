export function hasJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
               || type === '[object Array]';
    }
    catch (err) {
        return false;
    }
}

export function formatQuizData(snapshot) {
    const topics = {
        id: snapshot.key,
        name: snapshot.key,
        value: JSON.stringify(snapshot),
        json: true,
        children: []
    };
    snapshot.forEach(topicSnapshot => {
        const topic = {
            id: `${topics.id}/${topicSnapshot.key}`,
            name: topicSnapshot.key,
            value: JSON.stringify(topicSnapshot),
            json: true,
            children: []
        };
        topicSnapshot.forEach(languageSnapshot => {
            const lang = {
                id: `${topic.id}/${languageSnapshot.key}`,
                name: languageSnapshot.key,
                value: JSON.stringify(languageSnapshot),
                json: true,
                children: []
            };
            topic.children.push(lang);
            languageSnapshot.forEach(questionSnapshot => {
                const question = {
                    id: `${lang.id}/${questionSnapshot.key}`,
                    name: questionSnapshot.key,
                    value: JSON.stringify(questionSnapshot),
                    json: true,
                    children: []
                };
                lang.children.push(question);
                questionSnapshot.forEach(answersSnapshot => {
                    const answerRef = `${question.id}/${answersSnapshot.key}`;
                    const answers = {
                        id: answerRef,
                        name: answersSnapshot.key,
                        value: answersSnapshot.val(),
                        children: [
                            {
                                id: `${answerRef}/last`,
                                name: answersSnapshot.val(),
                                value: answersSnapshot.val()
                            }
                        ]
                    };
                    question.children.push(answers);
                });
            });
        });
        topics.children.push(topic);
    });
    
    return topics.children.length ? topics : null;
}

export function formatSelectionWotds(snapshot) {
    const wordsSelectionSnap = snapshot.child('selection');
    const wordsSelection = {
        id: wordsSelectionSnap.key,
        name: wordsSelectionSnap.key,
        children: []
    };
    wordsSelectionSnap.forEach(word => {
        wordsSelection.children.push(
            {
                id: `${wordsSelection.id}/${word.key}`,
                name: word.val(),
                value: word.val()
            }
        );
    });
    
    return wordsSelection.children.length ? wordsSelection : null;
}

export function formatPastWotds(snapshot) {
    const pastWordsSnap = snapshot.child('past');
    const pastWords = {
        id: pastWordsSnap.key,
        name: pastWordsSnap.key,
        children: []
    };
    pastWordsSnap.forEach(wordSnap => {
        const wordRef = `${pastWords.id}/${wordSnap.key}`;
        const word = {
            id: wordRef,
            name: wordSnap.key,
            value: JSON.stringify(wordSnap),
            json: true,
            children: []
        };
        wordSnap.forEach(attributeSnap => {
            const attributeRef = `${wordRef}/${attributeSnap.key}`;
            const attribute = {
                id: attributeRef,
                name: attributeSnap.key,
                value: attributeSnap.val(),
                children: [
                    {
                        id: `${attributeRef}/last`,
                        name: attributeSnap.val(),
                        value: attributeSnap.val()
                    }
                ]
            };
            word.children.push(attribute);
        });
        pastWords.children.push(word);
    });
    
    pastWords.children.sort((a, b) => {
            const [dateA, monthA, yearA] = a.name.split('-');
            const [dateB, monthB, yearB] = b.name.split('-');
            return new Date(yearA, monthA, dateA) - new Date(yearB, monthB, dateB);
        })
        .reverse();
    
    return pastWords.children.length ? pastWords : null;
}

export function formatTranslatorData(snapshot) {
    const users = [];
    snapshot.forEach(userSnapshot => {
        const translatorCollections = userSnapshot.child('translatorCollections');
        const user = {
            id: userSnapshot.key,
            name: userSnapshot.key,
            children: [{
                id: `${userSnapshot.key}/translatorCollections`,
                name: 'translatorCollections',
                value: JSON.stringify(translatorCollections),
                json: true,
                children: []
            }]
        }
        translatorCollections.forEach(collectionSnapshot => {
            const collection = {
                id: `${user.children[0].id}/${collectionSnapshot.key}`,
                name: collectionSnapshot.key,
                value: JSON.stringify(collectionSnapshot),
                json: true,
                children: []
            }
            collectionSnapshot.forEach(translationSnapshot => {
                const translation = {
                    id: `${collection.id}/${translationSnapshot.key}`,
                    name: translationSnapshot.key,
                    value: JSON.stringify(translationSnapshot),
                    json: true,
                    children: []
                }
                translationSnapshot.forEach(attributeSnapshot => {
                    const attributeRef = `${translation.id}/${attributeSnapshot.key}`;
                    const attribute = {
                        id: attributeRef,
                        name: attributeSnapshot.key,
                        value: attributeSnapshot.val(),
                        children: [{
                            id: `${attributeRef}/last`,
                            name: attributeSnapshot.val(),
                            value: attributeSnapshot.val()
                        }]
                    }
                    translation.children.push(attribute);
                })
                collection.children.push(translation);
            })
            user.children[0].children.push(collection);
        })
        users.push(user);
    })
    return users.length ? users : null;
}
