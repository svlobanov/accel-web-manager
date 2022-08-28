import sys

# prints stdout, returns exit code
# this mock does not print to stderr
print(sys.argv[2])  # print to stdout
sys.exit(int(sys.argv[1]))  # exit with specified code
