#!/bin/bash
# packages a proper popclip extension

copy_slash_header() {
  local src="$1"
  local dst="$2"

  if [[ -z "$src" || -z "$dst" ]]; then
    echo "Usage: copy_slash_header source_file destination_file" >&2
    return 1
  fi

  if [[ ! -f "$src" || ! -f "$dst" ]]; then
    echo "Both source and destination must exist" >&2
    return 1
  fi

  # Extract top // comment block from src
  local header
  header=$(awk '
    NR==1 && $0 !~ /^[[:space:]]*\/\// { exit }  # no header at all
    /^[[:space:]]*\/\// { print; next }         # print comment lines (allow leading spaces)
    { exit }                                    # stop at first non-comment
  ' "$src")

  if [[ -z "$header" ]]; then
    echo "No // header found in $src" >&2
    return 1
  fi

  local tmp
  tmp=$(mktemp) || return 1

  {
    printf '%s\n\n' "$header"
    cat "$dst"
  } > "$tmp" && mv "$tmp" "$dst"
}

rm -rf LLM_Superset.popclipext
mkdir LLM_Superset.popclipext
cp src/Config.js LLM_Superset.popclipext/Config.js
copy_slash_header src/Config.ts LLM_Superset.popclipext/Config.js