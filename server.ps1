$port = 8080
$root = "c:\Users\C.Pranav\Desktop\Networking"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server is running! Access the site at: http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path $root $localPath.Replace('/', '\')
        
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            switch ($ext) {
                ".html" { $contentType = "text/html" }
                ".css"  { $contentType = "text/css" }
                ".js"   { $contentType = "application/javascript" }
                ".svg"  { $contentType = "image/svg+xml" }
            }
            
            $response.ContentType = $contentType
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.StatusCode = 200
            Write-Host "200 GET $localPath"
        } else {
            $response.StatusCode = 404
            Write-Host "404 GET $localPath"
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Server stopped."
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
