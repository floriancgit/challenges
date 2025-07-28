# challenges
Help is provided with different languages. Quick readme for each of them:

## Python (updated content)
Root folder contains a `config.py.dist` meant to be duplicated to `config.py`. Then, store your Cookie value in the provided constant.

Python 3.5+ is preferred.

New Python files should start with
```python
#! /usr/bin/env python3
# coding: utf-8
import sys
sys.path.insert(0, '../..')
from config import *
from functions import *
get(URLS['prog']['_langage-tester']) # https://
```

PIP install
```python
source venv/bin/activate
pip3 install Pillow
# or
python3 -m pip install Pillow

```

## Java (old content)

## PHP (old content)
Each folder contains a `config.php.dist` meant to be duplicated to `config.php`. Then, store your Cookie cookie value in the provided constant

PHP >= 5.5 is used.

`context.php` may be required.
