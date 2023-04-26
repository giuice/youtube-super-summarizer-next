import os

def get_file_list(folder):
  """Gets a list of all files and subfolders in the specified folder.

  Args:
    folder: The path to the folder to get the file list for.

  Returns:
    A list of strings, where each string is the path to a file or subfolder in the specified folder.
  """

  file_list = []
  for root, dirs, files in os.walk(folder):
    for file in files:
      file_list.append(os.path.join(root, file))

  return file_list

def main():
  """The main function of the program.

  Args:
    None.

  Returns:
    None.
  """

  # Get the path to the folder to get the file list for.
  folder = input("Enter the path to the folder: ")

  # Get the list of files and subfolders in the specified folder.
  file_list = get_file_list(folder)

  # Print the list of files and subfolders on the screen.
  for file in file_list:
    if 'node_modules' in file or '.git' in file or '.next/' in file:
        continue
    print(file)

main()