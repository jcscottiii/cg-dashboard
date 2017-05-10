import os

'''
- echo "CONSOLE_TEST_USERNAME"
- echo "$CONSOLE_TEST_USERNAME"
- echo "CF_USERNAME"
- echo "$CF_USERNAME"
- echo "CF_PASSWORD"
- echo "$CF_PASSWORD"
- echo "CF_PASSWORD_GC"
- echo "$CF_PASSWORD_GC"
- echo "CONSOLE_TEST_PASSWORD"
- echo "$CONSOLE_TEST_PASSWORD"
'''

print('1')
print os.environ.get('CONSOLE_TEST_USERNAME')
print('2')
print os.environ.get('CF_USERNAME')
print('3')
print os.environ.get('CF_PASSWORD')
print('4')
print os.environ.get('CF_PASSWORD_GC')
print('5')
print os.environ.get('CONSOLE_TEST_PASSWORD')
