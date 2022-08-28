import sys

# returns exit code
# this mock does not print to stdout and stderr
sys.exit(int(sys.argv[1]))  # exit with specified code
