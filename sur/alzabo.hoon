|%
+$  state-0  [%0 api-key=@t]
+$  update
  $@  ~
  $%  [%error ~]
      [%api-key-saved ~]
  ==
+$  action
  $:  collection-name=@t
    $%  [%create ~]
        [%delete ~]
        [%add-document id=@tas embeddings=@t metadata=(map @tas @t) content=@t]
        [%query embeddings=@t n-results=@ud where=(map @tas @t)]
        [%reset ~]
        ::
        [%save-api-key key=@t]
    ==
  ==
--