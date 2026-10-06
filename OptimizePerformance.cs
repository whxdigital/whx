using System;
using System.IO;
using System.Linq;

public class OptimizePerformance
{
    public static void Main()
    {
        string rootDir = @"w:\PT WHX";
        var files = Directory.GetFiles(rootDir, "*.html", SearchOption.AllDirectories);

        string faOld = @"<link rel=""stylesheet"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"" />";
        string faNew = @"<link rel=""preload"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"" as=""style"" onload=""this.onload=null;this.rel='stylesheet'"" />
    <noscript><link rel=""stylesheet"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"" /></noscript>";

        string widgetOld = @"<script src=""https://widgets.leadconnectorhq.com/loader.js"" data-resources-url=""https://widgets.leadconnectorhq.com/chat-widget/loader.js"" data-widget-id=""6ab59fae50fc24ace6f7fff6""></script>";
        string widgetNew = @"<script defer src=""https://widgets.leadconnectorhq.com/loader.js"" data-resources-url=""https://widgets.leadconnectorhq.com/chat-widget/loader.js"" data-widget-id=""6ab59fae50fc24ace6f7fff6""></script>";

        int count = 0;
        foreach (var file in files)
        {
            string html = File.ReadAllText(file);
            bool changed = false;

            if (html.Contains(faOld))
            {
                html = html.Replace(faOld, faNew);
                changed = true;
            }

            if (html.Contains(widgetOld))
            {
                html = html.Replace(widgetOld, widgetNew);
                changed = true;
            }

            // Also check for already partially optimized widget (just in case)
            if (html.Contains("<script defer src=\"https://widgets.leadconnectorhq.com/loader.js\""))
            {
                // Already deferred
            }

            if (changed)
            {
                File.WriteAllText(file, html);
                count++;
            }
        }
        Console.WriteLine("Updated " + count + " files with performance optimizations.");
    }
}
