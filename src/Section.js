export default function Section(initialValue, ...intents) {
    if (!(this instanceof Section)) {
        return new Section(initialValue, ...intents);
    }

    this.value = initialValue;
    this.intents = [];

    intents.forEach(intent => this.addIntent(intent));
}

Section.prototype.addIntent = function addIntent(intent) {
    const intentName = intent.name;

    let intentHandlers = this.intents[intentName];
    if (intentHandlers == null) {
        this.intents[intentName] = intentHandlers = [];
    }

    intentHandlers.push(intent);
};

Section.prototype.removeIntent = function removeIntent(intent) {
    const intentName = intent.name;
    const intentHandlers = this.intents[intentName];

    if (intentHandlers == null) return;

    const intentIdx = intentHandlers.indexOf(intent);
    if (intentIdx >= 0) {
        intentHandlers.splice(intentIdx, 1);
        if (intentHandlers.length === 0) {
            delete this.intents[intentName];
        }
    }
};

Section.prototype.handleIntent = function handleIntent(intentName, payload) {
    if (this.intents[intentName] == null) {
        return false;
    } else {
        this.value = (this.intents[intentName] || []).reduce(
            (value, subscribedIntent) => {
                return subscribedIntent.mutate(value, payload);
            },
            this.value
        );
        return true;
    }
};