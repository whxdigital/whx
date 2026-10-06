using System;
using System.IO;

class AddLLMPicker
{
    static void Main()
    {
        string[] dashboardFiles = Directory.GetFiles(".", "dashboard.html", SearchOption.AllDirectories);
        
        string llmHtml = @"
                <!-- AI Workflow LLM Picker -->
                <div class=""llm-picker-section"" style=""background: rgba(13, 19, 30, 0.8); border: 1px solid var(--dash-border); border-radius: 16px; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 2rem;"">
                  <div style=""display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;"">
                    <h3 style=""color: #fff;""><i class=""fa-solid fa-wand-magic-sparkles"" style=""color: #ffb340;""></i> Pick Best LLM for Your Workflow</h3>
                    <span style=""color: #64748b; font-size: 0.85rem;"">Select top models dynamically</span>
                  </div>
                  
                  <div style=""display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;"">
                    
                    <label class=""llm-card"" style=""cursor: pointer; position: relative;"">
                      <input type=""radio"" name=""llm-select"" value=""claude"" style=""position: absolute; opacity: 0; pointer-events: none;"" checked>
                      <div class=""llm-card-inner"" style=""border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.2); transition: 0.3s; text-align: center;"">
                        <i class=""fa-solid fa-brain"" style=""font-size: 1.8rem; color: #cc8866; margin-bottom: 10px; display: block;""></i>
                        <strong style=""display: block; color: #f1f5f9;"">Claude 3.5 Sonnet</strong>
                        <span style=""font-size: 0.8rem; color: #94a3b8;"">Best for Coding & Reasoning</span>
                      </div>
                    </label>

                    <label class=""llm-card"" style=""cursor: pointer; position: relative;"">
                      <input type=""radio"" name=""llm-select"" value=""gpt"">
                      <div class=""llm-card-inner"" style=""border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.2); transition: 0.3s; text-align: center;"">
                        <i class=""fa-solid fa-certificate"" style=""font-size: 1.8rem; color: #10b981; margin-bottom: 10px; display: block;""></i>
                        <strong style=""display: block; color: #f1f5f9;"">ChatGPT 4o</strong>
                        <span style=""font-size: 0.8rem; color: #94a3b8;"">Best for General Tasks</span>
                      </div>
                    </label>

                    <label class=""llm-card"" style=""cursor: pointer; position: relative;"">
                      <input type=""radio"" name=""llm-select"" value=""astra"">
                      <div class=""llm-card-inner"" style=""border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.2); transition: 0.3s; text-align: center;"">
                        <i class=""fa-solid fa-eye"" style=""font-size: 1.8rem; color: #3b82f6; margin-bottom: 10px; display: block;""></i>
                        <strong style=""display: block; color: #f1f5f9;"">Google Astra</strong>
                        <span style=""font-size: 0.8rem; color: #94a3b8;"">Real-Time Multimodal</span>
                      </div>
                    </label>

                    <label class=""llm-card"" style=""cursor: pointer; position: relative;"">
                      <input type=""radio"" name=""llm-select"" value=""gemini"">
                      <div class=""llm-card-inner"" style=""border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.2); transition: 0.3s; text-align: center;"">
                        <i class=""fa-solid fa-wand-sparkles"" style=""font-size: 1.8rem; color: #8b5cf6; margin-bottom: 10px; display: block;""></i>
                        <strong style=""display: block; color: #f1f5f9;"">Gemini 1.5 Pro</strong>
                        <span style=""font-size: 0.8rem; color: #94a3b8;"">Massive Context Window</span>
                      </div>
                    </label>

                    <label class=""llm-card"" style=""cursor: pointer; position: relative;"">
                      <input type=""radio"" name=""llm-select"" value=""grok"">
                      <div class=""llm-card-inner"" style=""border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.2); transition: 0.3s; text-align: center;"">
                        <i class=""fa-solid fa-bolt"" style=""font-size: 1.8rem; color: #f59e0b; margin-bottom: 10px; display: block;""></i>
                        <strong style=""display: block; color: #f1f5f9;"">xAI Grok 2</strong>
                        <span style=""font-size: 0.8rem; color: #94a3b8;"">Real-time Twitter Knowledge</span>
                      </div>
                    </label>
                    
                    <label class=""llm-card"" style=""cursor: pointer; position: relative;"">
                      <input type=""radio"" name=""llm-select"" value=""perplexity"">
                      <div class=""llm-card-inner"" style=""border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.2); transition: 0.3s; text-align: center;"">
                        <i class=""fa-solid fa-magnifying-glass-chart"" style=""font-size: 1.8rem; color: #06b6d4; margin-bottom: 10px; display: block;""></i>
                        <strong style=""display: block; color: #f1f5f9;"">Perplexity Pro</strong>
                        <span style=""font-size: 0.8rem; color: #94a3b8;"">Deep Research Engine</span>
                      </div>
                    </label>

                    <label class=""llm-card"" style=""cursor: pointer; position: relative;"">
                      <input type=""radio"" name=""llm-select"" value=""manus"">
                      <div class=""llm-card-inner"" style=""border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; background: rgba(0,0,0,0.2); transition: 0.3s; text-align: center;"">
                        <i class=""fa-solid fa-robot"" style=""font-size: 1.8rem; color: #ec4899; margin-bottom: 10px; display: block;""></i>
                        <strong style=""display: block; color: #f1f5f9;"">Manus AI</strong>
                        <span style=""font-size: 0.8rem; color: #94a3b8;"">Autonomous Task Execution</span>
                      </div>
                    </label>

                  </div>
                  
                  <div style=""margin-top: 20px; display: flex; justify-content: flex-end;"">
                    <button class=""button button-primary outline btn-small"" onclick=""alert('LLM applied to workflow successfully!'); return false;"" style=""box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);""><i class=""fa-solid fa-check""></i> Apply to Workflow</button>
                  </div>

                  <style>
                    .llm-card input[type=""radio""] {
                      position: absolute;
                      opacity: 0;
                    }
                    .llm-card input[type=""radio""]:checked + .llm-card-inner {
                      border-color: #ffb340 !important;
                      background: rgba(255, 179, 64, 0.1) !important;
                      box-shadow: 0 0 15px rgba(255, 179, 64, 0.2);
                    }
                    .llm-card:hover .llm-card-inner {
                      border-color: rgba(255,255,255,0.3);
                      background: rgba(255,255,255,0.05);
                    }
                  </style>
                </div>
";

        foreach (string file in dashboardFiles)
        {
            string content = File.ReadAllText(file);
            if (content.Contains("llm-picker-section")) continue;

            string target = "<!-- Bottom Row: Multi-Agent Live Terminal Log -->";
            if (content.Contains(target))
            {
                content = content.Replace(target, llmHtml + "\r\n                " + target);
                File.WriteAllText(file, content);
                Console.WriteLine("Updated " + file);
            }
        }
    }
}
