using System;
using System.IO;
using System.Text.RegularExpressions;

public class CssMinifier
{
    public static void Minify(string inputPath, string outputPath)
    {
        string css = File.ReadAllText(inputPath);
        
        // Remove comments
        css = Regex.Replace(css, @"/\*.*?\*/", "", RegexOptions.Singleline);
        
        // Remove extra whitespace
        css = Regex.Replace(css, @"\s+", " ");
        
        // Remove whitespace around punctuation
        css = Regex.Replace(css, @"\s*([\{\}\:\;\,\>])\s*", "$1");
        
        // Remove the final semicolon in a block
        css = Regex.Replace(css, @";\}", "}");
        
        File.WriteAllText(outputPath, css);
    }
}
