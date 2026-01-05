const ejs = require('ejs');
const path = require('path');

const renderTemplate = async (templateName, data) => {
    const templatePath = path.join(__dirname, '../views/emails', `${templateName}.ejs`);
    return await ejs.renderFile(templatePath, data);
};

module.exports = renderTemplate;