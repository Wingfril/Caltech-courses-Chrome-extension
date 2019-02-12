# importing required modules
import PyPDF2
import re
import fitz
# creating a pdf file object
#pdfFileObj = #open('caltech_catalog-1819-section_5.pdf', 'rb')

# creating a pdf reader object
pdfReader = fitz.open("caltech_catalog-1819-section_5.pdf")#PyPDF2.PdfFileReader(pdfFileObj)

# printing number of pages in pdf file
all_classes_num = {}

all_classes_name = {}

split_loc = 2
for i in range(pdfReader.pageCount):#pdfReader.getNumPages()):

    pageObj = pdfReader.loadPage(i)#pdfReader.getPage(i)
    text = pageObj.getText()#pageObj.extractText()

    res = re.findall('[A-Z][a-zA-Z\/_\-]+ [0-9]+[ a-z]*\. [0-9a-zA-Z\/_\- :\&\'\’\n\(\)]+\.', text, re.DOTALL)
    for j in res:
        print(j)
        course_num = " ".join(j.split(" ")[:2])
        course_name = " ".join(j.split(" ")[2:])

        abc = j.split(" ")[2]
        if "." in abc and len(abc)<=4:
            course_name = " ".join(j.split(" ")[3:])
            for k in range(len(abc)-1):
                if course_num + abc[k] not in all_classes_num:
                    #print(course_num + abc[k])
                    all_classes_num[course_num + abc[k]] = 1
            if course_name not in all_classes_name:
                #print(course_name[:-1])
                all_classes_name[course_name[:-1]] = 1
        else:
            if course_num not in all_classes_num:
                #print(course_num[:-1])
                all_classes_num[course_num[:-1]] = 1
            if course_name not in all_classes_name:
                #print(course_name[:-1])
                all_classes_name[course_name[:-1]] = 1

arr = []
for i, _ in all_classes_num.items():
    arr.append(i)
arr.sort()
for i, _ in all_classes_name.items():
    arr.append(i)

import json
with open('data.json', 'w') as outfile:
    json.dump(all_classes_num, outfile)
    json.dump(all_classes_name, outfile)

file = open("all_classes.txt","w")
file.write("\n".join(arr))
file.close()
