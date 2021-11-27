const DataParser = require("./DataParser.js");
const Utility = require("./Utility.js");
const Data = require("./Data.js");
const Regex = require("./Regex.js");
const aliases = require("../aliases.json");

class Emote extends DataParser {
    constructor(query, name) {
        super(query);
        this.name = name;
        this.factor = Utility.indicateFactor(name);
        this.PRICE_INDEX = -2;
        this.DESCRIPTION_INDEX = 1;
        this.preview;
    }

    async scrapeAndJsonifyData() {
        if (!this.factor || !this.name) return (await super.scrapeData()).jsonifyData();

        await this.setHTMLBody();
        this.setBadgeChildren();
        this.setChangingIndexProperties();
        this.setLink();
        this.setPreview();

        if (!this.preview) return;

        const data = new Data()
            .setStatus(200)
            .setName(`${this.query} ${this.name}`)
            .setDescription(Utility.getValueAtIndex(this.badgeChildren, this.DESCRIPTION_INDEX).replace("[Character]", this.name))
            .setPrice(Utility.getValueAtIndex(this.badgeChildren, this.PRICE_INDEX))
            .setEssence(Utility.getValueAtIndex(this.badgeChildren, this.ESSENCE_INDEX))
            .setRarity(Utility.getValueAtIndex(this.badgeChildren, this.RARITY_INDEX))
            .setLink(this.link)
            .setAdditionalProperties({ preview: this.preview });

        return this.jsonifyData(data);
    }

    setLink() {
        //If no character name is provided then expect a general emote
        if (!this.name || !this.factor) return super.setLink();

        const linkElement = this._getLinkElement();
        if (!linkElement) return;
        const links = this._getAllLinksInsideLinkElement(linkElement);

        this.link = links.find(url => url.toLowerCase().includes(this.factor.slice(0, -1))) || links[0];
    }

    _getLinkElement() {
        return this.HTMLBody.match(Regex.ASIDE_ELEMENT_FOR_EMOTES_LAYOUT)?.[0];
    }

    _getAllLinksInsideLinkElement(linkElement) {
        return linkElement.match(Regex.IMAGES);
    }

    setPreview() {
        const gifs = this.HTMLBody.match(Regex.GIFS);
        const preferredAlias = Utility.findPreferredAlias(this.name);

        this.preview = gifs.find((gif) => {
            return gif.toLowerCase().includes(this.name.toLowerCase().replace(Regex.UNDERLINES, "")) ||
                gif.toLowerCase().includes(preferredAlias.toLowerCase().replace(Regex.UNDERLINES, "")) ||
                aliases.characters[this.factor][preferredAlias].some((value) => gif.toLowerCase().includes(value.toLowerCase().replace("_", "")));
        });
    }
}

module.exports = Emote;