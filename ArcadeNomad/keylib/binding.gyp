{
  "targets": [
    {
      "target_name": "keylib",
      "sources": [ "src/keylib.cpp", "src/mapping/keys.cpp", "src/presser/presser.cpp" ],
      "include_dirs" : [
          "<!(node -e \"require('nan')\")"
      ],
    }
  ]
}
