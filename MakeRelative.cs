using System;
using System.IO;
using System.Text.RegularExpressions;

public class MakeRelative
{
    public static void Main()
    {
        string rootDir = @"w:\PT WHX";
        var files = Directory.GetFiles(rootDir, "*.html", SearchOption.AllDirectories);

        foreach (var file in files)
        {
            string html = File.ReadAllText(file);
            bool changed = false;

            // Remove base tags
            string baseRegex = @"<script>if \(window\.location\.protocol === 'file:'\) document\.write\('<base href=""\.\./"">'?\);?</script>\s*<base href=""/"" />";
            if (Regex.IsMatch(html, baseRegex))
            {
                html = Regex.Replace(html, baseRegex, "");
                changed = true;
            }
            string baseRegex2 = @"<base href=""/"" />";
            if (Regex.IsMatch(html, baseRegex2))
            {
                html = Regex.Replace(html, baseRegex2, "");
                changed = true;
            }

            // Calculate depth
            string relativePath = file.Substring(rootDir.Length).TrimStart('\\');
            int depth = relativePath.Split('\\').Length - 1;
            
            string prefix = "";
            for (int i = 0; i < depth; i++)
            {
                prefix += "../";
            }

            // Replace href="/..." with href="prefix..."
            // Make sure not to replace href="//"
            string newHtml = Regex.Replace(html, @"href=""/([^/][^""]*)""", m => 
            {
                string path = m.Groups[1].Value;
                return string.Format(@"href=""{0}{1}""", prefix, path);
            });

            // Replace src="/..." with src="prefix..."
            newHtml = Regex.Replace(newHtml, @"src=""/([^/][^""]*)""", m => 
            {
                string path = m.Groups[1].Value;
                return string.Format(@"src=""{0}{1}""", prefix, path);
            });

            // Also, some href="/" should be href="prefix index.html"
            newHtml = Regex.Replace(newHtml, @"href=""/""", string.Format(@"href=""{0}index.html""", prefix));

            if (newHtml != html)
            {
                html = newHtml;
                changed = true;
            }

            if (changed)
            {
                File.WriteAllText(file, html);
                Console.WriteLine("Fixed relative paths in: " + relativePath);
            }
        }
        Console.WriteLine("Done.");
    }
}
