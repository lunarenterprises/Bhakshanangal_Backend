let model = require('../model/faq')
var { languages } = require("../languages/languageFunc");
var translatte = require("translatte");

module.exports.AddFaq = async (req, res) => {
    try {
        const { faq_question, faq_answer, lang = "en" } = req.body;
        const language = await languages(lang);

        if (!faq_question || !faq_answer) {
            return res.send({
                result: false,
                message: language.insufficient_parameters || "Please fill all required fields",
            });
        }

        const translateText = async (text) => {
            const ar = await translatte(text, { to: "ar" });
            const fr = await translatte(text, { to: "fr" });
            const hi = await translatte(text, { to: "hi" });
            const ml = await translatte(text, { to: "ml" });
            return {
                en: text,
                ar: ar.text,
                fr: fr.text,
                hi: hi.text,
                ml: ml.text,
            };
        };

        // 4️⃣ Translate question and answer
        const faqQuestionTranslations = await translateText(faq_question);
        const faqAnswerTranslations = await translateText(faq_answer);

        // 5️⃣ Add FAQ to DB
        const addFaq = await model.AddFaq(faq_question, faq_answer);
        const faqId = addFaq.insertId;

        if (faqId) {
            // 6️⃣ Add translations
            const langArray = [
                { lannum: 0, lancod: "en", question: faqQuestionTranslations.en, answer: faqAnswerTranslations.en },
                { lannum: 1, lancod: "ar", question: faqQuestionTranslations.ar, answer: faqAnswerTranslations.ar },
                { lannum: 2, lancod: "fr", question: faqQuestionTranslations.fr, answer: faqAnswerTranslations.fr },
                { lannum: 3, lancod: "hi", question: faqQuestionTranslations.hi, answer: faqAnswerTranslations.hi },
                { lannum: 4, lancod: "ml", question: faqQuestionTranslations.ml, answer: faqAnswerTranslations.ml },
            ];

            for (const t of langArray) {
                await model.AddFaqTranslation(faqId, t.lannum, t.lancod, t.question, t.answer);
            }

            return res.send({
                result: true,
                message: "FAQ question and answer added sucessfully",
            });
        } else {
            return res.send({
                result: false,
                message: "Failed to add FAQ. Please try again",
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message || "Something went wrong",
        });
    }
};



module.exports.EditFaq = async (req, res) => {
    try {
        const { faq_id, faq_question, faq_answer, lang = "en" } = req.body;
        const language = await languages(lang);

        // 1️⃣ Validation
        if (!faq_id || !faq_question || !faq_answer) {
            return res.send({
                result: false,
                message: language.insufficient_parameters || "Please fill all required fields",
            });
        }

        // 2️⃣ Check if FAQ exists
        const existingFaq = await model.GetFaqById(faq_id);
        if (!existingFaq || existingFaq.length === 0) {
            return res.send({
                result: false,
                message: language.FAQ_not_found || "FAQ not found",
            });
        }

        // 4️⃣ Translation helper
        const translateText = async (text) => {
            const ar = await translatte(text, { to: "ar" });
            const fr = await translatte(text, { to: "fr" });
            const hi = await translatte(text, { to: "hi" });
            const ml = await translatte(text, { to: "ml" });

            return {
                en: text,
                ar: ar.text,
                fr: fr.text,
                hi: hi.text,
                ml: ml.text,
            };
        };

        // 5️⃣ Translate question and answer
        const faqQuestionTranslations = await translateText(faq_question);
        const faqAnswerTranslations = await translateText(faq_answer);

        // 6️⃣ Update FAQ main data
        const updatedFaq = await model.UpdateFaq(faq_id, faq_question, faq_answer);

        if (updatedFaq.affectedRows > 0) {
            // 7️⃣ Update translations
            const langArray = [
                { lannum: 0, lancod: "en", question: faqQuestionTranslations.en, answer: faqAnswerTranslations.en },
                { lannum: 1, lancod: "ar", question: faqQuestionTranslations.ar, answer: faqAnswerTranslations.ar },
                { lannum: 2, lancod: "fr", question: faqQuestionTranslations.fr, answer: faqAnswerTranslations.fr },
                { lannum: 3, lancod: "hi", question: faqQuestionTranslations.hi, answer: faqAnswerTranslations.hi },
                { lannum: 4, lancod: "ml", question: faqQuestionTranslations.ml, answer: faqAnswerTranslations.ml },
            ];

            for (const t of langArray) {
                await model.UpdateFaqTranslation(faq_id, t.lannum, t.lancod, t.question, t.answer);
            }

            return res.send({
                result: true,
                message: language.FAQ_updated_success || "FAQ updated successfully",
            });
        } else {
            return res.send({
                result: false,
                message: language.FAQ_update_failed || "Failed to update FAQ. Please try again",
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message || "Something went wrong",
        });
    }
};


module.exports.ListFaqs = async (req, res) => {
    try {
        const { lang = 'en' } = req.body; // default to English

        const faqs = await model.ListFaqsByLanguage(lang);

        if (!faqs || faqs.length === 0) {
            return res.send({
                result: false,
                message: "No FAQs found",
                list: []
            });
        }

        return res.send({
            result: true,
            message: "FAQs retrieved successfully",
            list: faqs
        });
        
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
};

module.exports.DeleteFaq = async (req, res) => {
  try {
    const { faq_id, lang = 'en' } = req.body;
    const language = await languages(lang);

    if (!faq_id) {
      return res.send({
        result: false,
        message: language.insufficient_parameters || "FAQ ID is required"
      });
    }

    // Check if FAQ exists
    const faq = await model.GetFaqById(faq_id);
    if (!faq || faq.length === 0) {
      return res.send({
        result: false,
        message: language.FAQ_not_found || "FAQ not found"
      });
    }

    // Delete FAQ and translations
    await model.DeleteFaq(faq_id);

    return res.send({
      result: true,
      message: language.FAQ_deleted_success || "FAQ deleted successfully"
    });

  } catch (error) {
    return res.send({
      result: false,
      message: error.message
    });
  }
};
