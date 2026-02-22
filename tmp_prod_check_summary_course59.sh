#!/usr/bin/env bash
for s in 862 863 864 865 866 867 868 869 870 871 872 873 874 875 2098; do
  printf '%s -> ' "$s"
  curl -s "http://127.0.0.1:8080/course/session/$s/summary"
  echo
done
