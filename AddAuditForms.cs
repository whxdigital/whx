using System;
using System.IO;
using System.Text.RegularExpressions;

class AddAuditForms
{
    static void Main()
    {
        string[] indexFiles = Directory.GetFiles(".", "index.html", SearchOption.AllDirectories);
        
        string formHtmlTemplate = @"
            <div style=""margin-top: 15px;"">
              <form action=""PREFIXtools/website-audit/index.html"" method=""GET"" style=""display: flex; gap: 8px; width: 100%;"">
                <div style=""flex: 1; position: relative; display: flex; align-items: center;"">
                  <i class=""fa-solid fa-globe"" style=""position: absolute; left: 12px; color: #94a3b8; font-size: 0.9rem;""></i>
                  <input type=""text"" name=""url"" style=""width: 100%; padding: 10px 10px 10px 34px; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; outline: none; background: rgba(0,0,0,0.2); color: #f8fafc;"" placeholder=""Enter website URL"" required />
                </div>
                <button type=""submit"" style=""background: #7c3aed; color: #fff; border: none; border-radius: 8px; padding: 0 16px; font-weight: 600; cursor: pointer; transition: 0.2s; white-space: nowrap; font-size: 0.85rem;"">
                  {0} <i class=""fa-solid fa-arrow-right""></i>
                </button>
              </form>
            </div>
          </div>";

        foreach (string file in indexFiles)
        {
            // skip website-audit index.html
            if (file.Contains("website-audit") || file.Contains("insights")) continue;

            string content = File.ReadAllText(file);
            bool changed = false;

            // Calculate prefix
            int depth = file.Split(Path.DirectorySeparatorChar).Length - 2; // .\index.html -> 0
            string prefix = "";
            for (int i = 0; i < depth; i++) prefix += "../";

            string localSeoForm = string.Format(formHtmlTemplate, "Audit My Local SEO").Replace("PREFIX", prefix);
            string gmpForm = string.Format(formHtmlTemplate, "Rank in Map Pack").Replace("PREFIX", prefix);
            string citationForm = string.Format(formHtmlTemplate, "Check Citations").Replace("PREFIX", prefix);
            string linkForm = string.Format(formHtmlTemplate, "Analyze Backlinks").Replace("PREFIX", prefix);

            string search1 = @"<a href=""#connect"" class=""search-card-cta"">Audit My Local SEO <i class=""fa-solid fa-arrow-right"" aria-hidden=""true""></i></a>\s*</div>";
            string search2 = @"<a href=""#connect"" class=""search-card-cta"">Rank in Map Pack <i class=""fa-solid fa-arrow-right"" aria-hidden=""true""></i></a>\s*</div>";
            string search3 = @"<a href=""#connect"" class=""search-card-cta"">Check Citation Score <i class=""fa-solid fa-arrow-right"" aria-hidden=""true""></i></a>\s*</div>";
            string search4 = @"<a href=""#connect"" class=""search-card-cta"">Analyze Backlinks <i class=""fa-solid fa-arrow-right"" aria-hidden=""true""></i></a>\s*</div>";

            if (Regex.IsMatch(content, search1)) { content = Regex.Replace(content, search1, localSeoForm); changed = true; }
            if (Regex.IsMatch(content, search2)) { content = Regex.Replace(content, search2, gmpForm); changed = true; }
            if (Regex.IsMatch(content, search3)) { content = Regex.Replace(content, search3, citationForm); changed = true; }
            if (Regex.IsMatch(content, search4)) { content = Regex.Replace(content, search4, linkForm); changed = true; }

            if (changed)
            {
                File.WriteAllText(file, content);
                Console.WriteLine("Updated " + file);
            }
        }
    }
}
