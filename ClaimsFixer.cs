using System;
using System.IO;

public class ClaimsFixer
{
    public static void FixClaims(string filePath)
    {
        string html = File.ReadAllText(filePath);
        
        string originalHtml = html;

        // "10x operational efficiency" -> "significant operational efficiency"
        html = html.Replace("10x operational efficiency", "significant operational efficiency");
        
        // "indexing guarantee" -> "indexing support"
        html = html.Replace("indexing guarantee", "indexing support");
        
        // "Instant AI Booking" -> "Automated AI Booking"
        html = html.Replace("Instant AI Booking", "Automated AI Booking");
        
        // "Guaranteed &lt;24hr Response" -> "Targeted &lt;24hr Response"
        html = html.Replace("Guaranteed &lt;24hr Response", "Targeted &lt;24hr Response");
        html = html.Replace("Guaranteed <24hr Response", "Targeted <24hr Response");
        
        // "90+ Score Guarantee" -> "90+ Score Target"
        html = html.Replace("90+ Score Guarantee", "90+ Score Target");
        
        // "Instant Fix Budget" -> "Performance Fix Budget"
        html = html.Replace("Instant Fix Budget", "Performance Fix Budget");
        
        // "route qualified deals instantly" -> "route qualified deals automatically"
        html = html.Replace("route qualified deals instantly", "route qualified deals automatically");
        
        // "pause the AI agent instantly" -> "pause the AI agent immediately"
        html = html.Replace("pause the AI agent instantly", "pause the AI agent immediately");
        
        // "book meetings instantly" -> "book meetings automatically"
        html = html.Replace("book meetings instantly", "book meetings automatically");
        
        // "instant access" -> "immediate access"
        html = html.Replace("instant access", "immediate access");
        
        // "instant lead scores" -> "automated lead scores"
        html = html.Replace("instant lead scores", "automated lead scores");
        
        // "instant retry" -> "immediate retry"
        html = html.Replace("instant retry", "immediate retry");
        
        // "cannot guarantee" -> "cannot promise"
        html = html.Replace("cannot guarantee", "cannot promise");

        if (originalHtml != html)
        {
            File.WriteAllText(filePath, html);
            Console.WriteLine("Fixed " + filePath);
        }
    }
}
