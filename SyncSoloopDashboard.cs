using System;
using System.IO;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string rootDir = @"w:\PT WHX";
        string rootDashboard = Path.Combine(rootDir, "dashboard.html");
        if (!File.Exists(rootDashboard)) return;

        string sourceHtml = File.ReadAllText(rootDashboard);
        string[] langDirs = new string[] { "pt", "es", "fr", "de", "it", "nl", "ar" };

        foreach (string lang in langDirs)
        {
            string targetDir = Path.Combine(rootDir, lang);
            if (!Directory.Exists(targetDir)) continue;

            string targetFile = Path.Combine(targetDir, "dashboard.html");

            // For depth 1 (e.g. w:\PT WHX\pt\dashboard.html):
            // Replace relative CSS links: href="soloop_dashboard.css" -> href="../soloop_dashboard.css"
            // Replace index.html links: href="index.html" -> href="index.html" (since pt/index.html exists)
            string modified = sourceHtml;

            // Update css / asset paths
            modified = modified.Replace("href=\"style.min.css\"", "href=\"../style.min.css\"");
            modified = modified.Replace("href=\"dashboard.css\"", "href=\"../dashboard.css\"");
            modified = modified.Replace("href=\"advanced_styles.css\"", "href=\"../advanced_styles.css\"");
            modified = modified.Replace("href=\"premium_dashboard.css\"", "href=\"../premium_dashboard.css\"");
            modified = modified.Replace("href=\"soloop_dashboard.css\"", "href=\"../soloop_dashboard.css\"");

            File.WriteAllText(targetFile, modified);
            Console.WriteLine("Synced to " + targetFile);
        }
    }
}
