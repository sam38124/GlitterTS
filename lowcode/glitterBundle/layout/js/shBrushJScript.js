/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 *
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
(function(){typeof require!="undefined"?SyntaxHighlighter=require("src/glitterBundle/layout/js/shCore").SyntaxHighlighter:null;function Brush(){var keywords="break case catch continue "+"default delete do else false  "+"for function if in instanceof "+"new null return super switch "+"this throw true try typeof var while with";var r=SyntaxHighlighter.regexLib;this.regexList=[{regex:r.multiLineDoubleQuotedString,css:"string"},{regex:r.multiLineSingleQuotedString,css:"string"},{regex:r.singleLineCComments,css:"comments"},{regex:r.multiLineCComments,css:"comments"},{regex:/\s*#.*/gm,css:"preprocessor"},{regex:new RegExp(this.getKeywords(keywords),"gm"),css:"keyword"}];this.forHtmlScript(r.scriptScriptTags)}Brush.prototype=new SyntaxHighlighter.Highlighter;Brush.aliases=["js","jscript","javascript"];SyntaxHighlighter.brushes.JScript=Brush;typeof exports!="undefined"?exports.Brush=Brush:null})();