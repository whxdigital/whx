using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Linq;

class Program
{
    static void Main()
    {
        string rootDir = @"w:\PT WHX";
        string[] htmlFiles = Directory.GetFiles(rootDir, "*.html", SearchOption.AllDirectories);

        foreach (string file in htmlFiles)
        {
            string html = File.ReadAllText(file);
            bool changed = false;

            // Fix 1: Wrap dashboard link in <li>
            string dashPattern = @"(<ul class=""nav-links"">.*?)(<a href=""[^""]*dashboard\.html"" class=""nav-dashboard-btn""[^>]*>.*?</a>)(.*?</ul>)";
            if (Regex.IsMatch(html, dashPattern, RegexOptions.Singleline))
            {
                html = Regex.Replace(html, dashPattern, "$1<li>$2</li>$3", RegexOptions.Singleline);
                changed = true;
            }

            // Fix 2: Update injected forms
            // Previous pattern: <form action="PREFIXtools/website-audit/index.html" method="GET"...
            string formPattern = @"<form action=""([^""]*tools/website-audit/index\.html)"" method=""GET""(.*?)>";
            if (Regex.IsMatch(html, formPattern, RegexOptions.Singleline))
            {
                html = Regex.Replace(html, formPattern, m => {
                    string actionUrl = m.Groups[1].Value;
                    string rest = m.Groups[2].Value;
                    string onsubmit = string.Format(@"onsubmit=""event.preventDefault(); var u = this.querySelector('input').value; var dest = '{0}'; if(window.location.protocol !== 'file:') dest += '?url=' + encodeURIComponent(u); window.location.href = dest;""", actionUrl);
                    return string.Format(@"<form {0}{1}>", onsubmit, rest);
                }, RegexOptions.Singleline);
                changed = true;
            }

            if (changed)
            {
                File.WriteAllText(file, html);
                Console.WriteLine("Updated " + file);
            }
        }
        
        // Fix 3: Dashboard LLM Picker
        string dashboardPath = Path.Combine(rootDir, "dashboard.html");
        if (File.Exists(dashboardPath))
        {
            string dashHtml = File.ReadAllText(dashboardPath);
            bool dashChanged = false;
            
            if (dashHtml.Contains("Claude 3.5 Sonnet") && !dashHtml.Contains("Opus"))
            {
                dashHtml = dashHtml.Replace("Claude 3.5 Sonnet", "Claude 3.7 Sonnet / Opus");
                dashChanged = true;
            }
            if (dashHtml.Contains("ChatGPT 4o") && !dashHtml.Contains("o3-mini"))
            {
                dashHtml = dashHtml.Replace("ChatGPT 4o", "ChatGPT 4.5 / o3-mini");
                dashChanged = true;
            }
            if (dashHtml.Contains("Gemini 1.5 Pro") && !dashHtml.Contains("Flash"))
            {
                dashHtml = dashHtml.Replace("Gemini 1.5 Pro", "Gemini 2.5 Pro / Flash");
                dashChanged = true;
            }
            if (dashHtml.Contains("xAI Grok 2") && !dashHtml.Contains("Grok 3"))
            {
                dashHtml = dashHtml.Replace("xAI Grok 2", "xAI Grok 3");
                dashChanged = true;
            }
            if (dashHtml.Contains("Perplexity Pro") && !dashHtml.Contains("Enterprise"))
            {
                dashHtml = dashHtml.Replace("Perplexity Pro", "Perplexity Pro / Enterprise");
                dashChanged = true;
            }
            
            if (dashChanged)
            {
                File.WriteAllText(dashboardPath, dashHtml);
                Console.WriteLine("Updated dashboard.html LLMs");
            }
        }
    }
}
