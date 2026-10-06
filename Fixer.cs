using System;
using System.IO;
using System.Text.RegularExpressions;

public class HtmlFixer
{
    public static void FixDuplicates(string filePath)
    {
        string html = File.ReadAllText(filePath);
        
        // Find the first </header> and the second </header>
        // Wait, the duplicate block starts with </header> and ends with the parallel-execution section.
        // Let's match from </header>\s*<main class="workforce-experience"> up to id="parallel-execution">.*?</section>
        
        string pattern = @"(?s)</header>\s*<main class=""workforce-experience"">.*?id=""parallel-execution"">.*?</section>";
        
        // Only replace if there are two <main class="workforce-experience">
        if (Regex.Matches(html, @"<main class=""workforce-experience"">").Count > 1) {
            html = Regex.Replace(html, pattern, "");
            File.WriteAllText(filePath, html);
            Console.WriteLine("Fixed " + filePath);
        }
    }
}
