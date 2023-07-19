test:
	pytest

build:
	python setup.py sdist bdist_wheel

check_build:
	twine check dist/*

remove_build:
	rm -rf build dist geosyspy.egg-info