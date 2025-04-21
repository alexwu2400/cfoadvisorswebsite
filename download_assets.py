import os
import requests
import urllib.parse
import re

# List of curl commands as a raw string
curl_commands = """
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205dc_CFO^%^20ADVISORS.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205dd_unsplash_ZGjbiukp_-A-p-500.png^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020610_a16z.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020613_general^%^20catalyst.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c62627902062a_first^%^20round.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020617_bessemer.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020612_insight.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c62627902062c_Sequoia_Capital_logo.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020611_basis^%^20set.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020616_Sam^%^20altman.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020600_Favicon.png^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://d3e54v103j8qbb.cloudfront.net/img/webflow-badge-icon-d2.89e12c322e.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://d3e54v103j8qbb.cloudfront.net/img/webflow-badge-text-d2.c82cec3b78.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c62627902061a_mercury.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205e2_Vectors-Wrapper.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205eb_Vectors-Wrapper.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205ec_Vectors-Wrapper.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205ee_Vectors-Wrapper.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205e1_Vectors-Wrapper.svg^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"Referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205ed_Vectors-Wrapper.svg^" ^
  -H ^"accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8^" ^
  -H ^"accept-language: en-US,en;q=0.9^" ^
  -H ^"priority: i^" ^
  -H ^"referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"sec-fetch-dest: image^" ^
  -H ^"sec-fetch-mode: no-cors^" ^
  -H ^"sec-fetch-site: cross-site^" ^
  -H ^"sec-fetch-storage-access: active^" ^
  -H ^"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c626279020618_5f3d6cb61f23f3681c64b090_vouch-logo-v2-lighter-blue-darker^%^201.svg^" ^
  -H ^"accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8^" ^
  -H ^"accept-language: en-US,en;q=0.9^" ^
  -H ^"priority: i^" ^
  -H ^"referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"sec-fetch-dest: image^" ^
  -H ^"sec-fetch-mode: no-cors^" ^
  -H ^"sec-fetch-site: cross-site^" ^
  -H ^"sec-fetch-storage-access: active^" ^
  -H ^"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^" &
curl ^"https://cdn.prod.website-files.com/680500ee770c6262790205b6/680500ee770c6262790205e5_Vectors-Wrapper.svg^" ^
  -H ^"accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8^" ^
  -H ^"accept-language: en-US,en;q=0.9^" ^
  -H ^"priority: i^" ^
  -H ^"referer: https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/^" ^
  -H ^"sec-ch-ua: ^\\^"Google Chrome^\\^";v=^\\^"135^\\^", ^\\^"Not-A.Brand^\\^";v=^\\^"8^\\^", ^\\^"Chromium^\\^";v=^\\^"135^\\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" ^
  -H ^"sec-ch-ua-platform: ^\\^"Windows^\\^"^" ^
  -H ^"sec-fetch-dest: image^" ^
  -H ^"sec-fetch-mode: no-cors^" ^
  -H ^"sec-fetch-site: cross-site^" ^
  -H ^"sec-fetch-storage-access: active^" ^
  -H ^"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36^"
"""

# Regex to find URLs within the curl commands (specifically the first argument after curl)
url_pattern = re.compile(r'curl \^"([^"]+)\^"')
urls = url_pattern.findall(curl_commands)

# Clean up URLs (replace Windows escape characters for URL encoding)
cleaned_urls = [url.replace('^%^', '%') for url in urls]

# Define the target directory
target_dir = "website/assets"

# Create the target directory if it doesn't exist
os.makedirs(target_dir, exist_ok=True)

# Headers to mimic a browser request (optional, but can help avoid blocks)
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Referer': 'https://cfoadvisors-248196d6728cfb467fea544aaab.webflow.io/' # Example referer from commands
}

# Download each file
for url in cleaned_urls:
    try:
        # Parse the URL to get the path and extract the filename
        path = urllib.parse.urlparse(url).path
        # Decode URL encoding in the filename (e.g., %20 -> space)
        filename = urllib.parse.unquote(os.path.basename(path))
        
        # Construct the full path to save the file
        save_path = os.path.join(target_dir, filename)
        
        print(f"Downloading {url} to {save_path}...")
        
        # Make the request
        response = requests.get(url, headers=headers, stream=True, timeout=30)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
        # Write the content to the file
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        print(f"Successfully downloaded {filename}")
        
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {url}: {e}")
    except Exception as e:
        print(f"An error occurred processing {url}: {e}")

print("\nDownload process finished.") 