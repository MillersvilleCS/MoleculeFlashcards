MoleculeFlashcards
==================

Setting up a project
----------------------------------------------
1.create a git repository 

  ~git init 
  
  ~git remote add origin https://github.com/MillersvilleCS/MoleculeFlashcards.git 
  
  ~git pull

2.create a subrepository for the framework 

  ~git submodule add https://github.com/MillersvilleCS/JSFramework.git public_html/framework 
  
  
Updateing subdirectories
git submodule foreach git pull origin master
  
