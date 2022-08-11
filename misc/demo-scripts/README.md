# Demo prepartion scripts

These scripts prepare data for static hosting (API replies). It might be useful for demonstration purposes and for development without real backend

## Get data from real backend

```bash
$ ./get-data.sh
```

Change port and hostname inside the script if required

## Obfuscate received data

User-Name, IP and Calling-Sid usually contain personal data that should be removed before publishing. Obfuscator script does this job

It is highly recommended to review `new_ip` function in `obfuscator.py`. At least, change the constants 18,15,97,23 or implement some new logic for IPv4 obfuscation 

```bash
$ cd data
$ ../obfuscator.py
```

Do not worry about the output

### Obfuscator limitations

- no IPv6 support. IPv6 and IPv6-DP are not changed
- Called-Sid is not obfuscated. Review your data before publishing
