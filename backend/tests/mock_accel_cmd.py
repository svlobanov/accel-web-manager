import sys

# prints stdout, stderr, returns exit code
print(sys.argv[2])  # print to stdout
if len(sys.argv) > 3:  # print to stderr
    print(sys.argv[3], file=sys.stderr)
sys.exit(int(sys.argv[1]))  # exit with specified code
